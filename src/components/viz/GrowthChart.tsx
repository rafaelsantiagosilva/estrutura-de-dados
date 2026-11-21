import { useId, useMemo, useState } from "react";
import { Axes, H, M, PH, PW, W, fmt, linePath, linearTicks, logTicks } from "./chart-utils";

type Curve = { id: string; label: string; color: string; f: (n: number) => number };

const curves: Curve[] = [
  { id: "1",    label: "1",       color: "#6b7c99", f: () => 1 },
  { id: "log",  label: "log n",   color: "#7dd3fc", f: (n) => Math.log2(n) },
  { id: "n",    label: "n",       color: "#62a0ff", f: (n) => n },
  { id: "nlog", label: "n log n", color: "#c4b5fd", f: (n) => n * Math.log2(n) },
  { id: "n2",   label: "n²",      color: "#fbbf24", f: (n) => n * n },
  { id: "2n",   label: "2ⁿ",      color: "#f87171", f: (n) => 2 ** n },
];

// show: quais curvas começam ligadas (ex.: show={["n", "n2"]}). Sem `show`, todas.
type Props = { show?: string[]; defaultN?: number };

export default function GrowthChart({ show, defaultN = 12 }: Props) {
  const clipId = useId().replace(/:/g, "") + "-clip";
  const [on, setOn] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(curves.map((c) => [c.id, !show || show.includes(c.id)])),
  );
  const [nMax, setNMax] = useState(defaultN);
  const [log, setLog] = useState(false);

  const vis = curves.filter((c) => on[c.id]);
  const xs = useMemo(
    () => Array.from({ length: 161 }, (_, i) => 1 + ((nMax - 1) * i) / 160),
    [nMax],
  );

  // Escala do eixo y: no modo linear o 2ⁿ não manda na escala (ele "sai" pelo topo)
  const bounded = vis.filter((c) => c.id !== "2n");
  const pool = log || bounded.length === 0 ? vis : bounded;
  const top = Math.max(1, ...pool.map((c) => c.f(nMax)));
  const yMax = log ? Math.max(10, top) : top * 1.08;

  const sx = (v: number) => M.l + (v / nMax) * PW;
  const sy = log
    ? (v: number) => M.t + PH - (Math.log10(Math.max(v, 1)) / Math.log10(yMax)) * PH
    : (v: number) => M.t + PH - (v / yMax) * PH;

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-card border border-ink-600 bg-ink-900">
      <figcaption className="flex items-center gap-2 border-b border-ink-600 bg-ink-800 px-4 py-2 font-mono text-xs text-ink-400">
        <span className="size-2 rounded-full bg-brand-500" />
        gráfico · <span className="text-brand-300">taxas de crescimento</span>
      </figcaption>

      {/* liga/desliga curvas */}
      <div className="flex flex-wrap gap-2 px-4 pt-4">
        {curves.map((c) => (
          <button
            key={c.id}
            aria-pressed={on[c.id]}
            onClick={() => setOn((s) => ({ ...s, [c.id]: !s[c.id] }))}
            className={`flex items-center gap-2 rounded-md border px-2.5 py-1 font-mono text-xs transition ${
              on[c.id]
                ? "border-ink-400 bg-ink-800 text-white"
                : "border-ink-700 text-ink-400 opacity-60 hover:opacity-100"
            }`}
          >
            <span className="size-2.5 rounded-full" style={{ background: c.color }} />
            {c.label}
          </button>
        ))}
      </div>

      <div className="px-2 pt-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Gráfico comparando taxas de crescimento">
          <defs>
            <clipPath id={clipId}>
              <rect x={M.l} y={M.t} width={PW} height={PH} />
            </clipPath>
          </defs>

          <Axes
            xTicks={linearTicks(nMax)}
            yTicks={log ? logTicks(yMax) : linearTicks(yMax)}
            sx={sx}
            sy={sy}
            xLabel="n (tamanho da entrada)"
            yLabel={log ? "operações (escala log)" : "operações"}
          />

          <g clipPath={`url(#${clipId})`}>
            {vis.map((c) => (
              <path
                key={c.id}
                d={linePath(xs, xs.map(c.f), sx, sy)}
                fill="none"
                stroke={c.color}
                strokeWidth={2.5}
                strokeLinejoin="round"
              />
            ))}
          </g>
        </svg>
      </div>

      {/* controles */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-ink-600 bg-ink-800 px-4 py-3 font-mono text-xs text-ink-200">
        <label className="flex min-w-56 flex-1 items-center gap-3">
          n máx = <span className="w-6 text-warn">{nMax}</span>
          <input
            type="range" min={5} max={30} value={nMax}
            onChange={(e) => setNMax(Number(e.target.value))}
            className="flex-1 accent-brand-500"
          />
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox" checked={log}
            onChange={(e) => setLog(e.target.checked)}
            className="accent-brand-500"
          />
          escala log no eixo y
        </label>
      </div>

      {/* valores na ponta direita */}
      <div className="border-t border-ink-600 px-4 py-3">
        <p className="mb-2 font-mono text-xs text-ink-400">Valores para n = {nMax}</p>
        <div className="flex flex-wrap gap-2">
          {vis.map((c) => (
            <span key={c.id} className="rounded-md border border-ink-600 bg-ink-800 px-2 py-0.5 font-mono text-xs">
              <span style={{ color: c.color }}>{c.label}</span>
              <span className="text-ink-400"> = </span>
              <span className="text-warn">{fmt(c.f(nMax))}</span>
            </span>
          ))}
        </div>
      </div>
    </figure>
  );
}