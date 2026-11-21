import { useId, useMemo, useState } from "react";
import Tex from "../math/Tex";
import { Axes, H, M, PH, PW, W, linePath, linearTicks } from "./chart-utils";

type Fn = (n: number) => number;
type Preset = {
  fTex: string; gTex: string; f: Fn; g: Fn;
  example: { c1: number; c2: number; n0: number };
  note: string;
};

const lg = Math.log2;

const presets: Preset[] = [
  { fTex: "3n+2", gTex: "n", f: (n) => 3 * n + 2, g: (n) => n,
    example: { c1: 3, c2: 4, n0: 2 },
    note: "O +2 vira \"detalhe\" perto de n quando n cresce: por isso 3n+2 = Θ(n)." },
  { fTex: "n^2+5n", gTex: "n^2", f: (n) => n * n + 5 * n, g: (n) => n * n,
    example: { c1: 1, c2: 2, n0: 5 },
    note: "O termo 5n perde para n² a partir de n = 5. O termo de maior grau manda." },
  { fTex: "2n\\log_2 n + n", gTex: "n\\log_2 n", f: (n) => 2 * n * lg(n) + n, g: (n) => n * lg(n),
    example: { c1: 2, c2: 3, n0: 2 },
    note: "Em n = 1 o log vale 0 e a conta falha. Por isso existe o n₀: só importa a partir dele." },
  { fTex: "n", gTex: "n^2", f: (n) => n, g: (n) => n * n,
    example: { c1: 0.1, c2: 1, n0: 1 },
    note: "n é O(n²), mas NÃO é Ω(n²): nenhum c₁ > 0 funciona para todo n grande. Logo, não é Θ(n²)." },
];

const N = 30;

function Slider(props: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void;
}) {
  const { label, value, min, max, step, onChange } = props;
  return (
    <label className="flex min-w-48 flex-1 items-center gap-3 font-mono text-xs text-ink-200">
      <span className="w-8 shrink-0"><Tex tex={label} /></span>
      <span className="w-8 shrink-0 text-warn">{Number.isInteger(value) ? value : value.toFixed(1)}</span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-brand-500"
      />
    </label>
  );
}

function Verdict({ ok, tex, rule }: { ok: boolean; tex: string; rule: string }) {
  return (
    <div
      className={`min-w-40 flex-1 rounded-lg border px-3 py-2 ${
        ok ? "border-ok/60 bg-ok/10" : "border-danger/50 bg-danger/10"
      }`}
    >
      <div className="flex items-center justify-between text-white">
        <Tex tex={tex} />
        <span>{ok ? "✅" : "❌"}</span>
      </div>
      <p className="mt-0.5 font-mono text-[11px] text-ink-400">{rule}</p>
    </div>
  );
}

export default function BigOExplorer() {
  const clipId = useId().replace(/:/g, "") + "-clip";
  const [pi, setPi] = useState(0);
  const [c1, setC1] = useState(1);
  const [c2, setC2] = useState(1);
  const [n0, setN0] = useState(1);
  const p = presets[pi];

  const reset = (i: number) => { setPi(i); setC1(1); setC2(1); setN0(1); };
  const showExample = () => { setC1(p.example.c1); setC2(p.example.c2); setN0(p.example.n0); };

  const xs = useMemo(() => Array.from({ length: 121 }, (_, i) => 1 + ((N - 1) * i) / 120), []);
  const yMax = p.f(N) * 1.2;
  const sx = (v: number) => M.l + (v / N) * PW;
  const sy = (v: number) => M.t + PH - (v / yMax) * PH;

  // verificação numérica: para todo n inteiro de n0 até N
  let upper = true, lower = true;
  for (let n = n0; n <= N; n++) {
    if (p.f(n) > c2 * p.g(n) + 1e-9) upper = false;
    if (p.f(n) < c1 * p.g(n) - 1e-9) lower = false;
  }

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-card border border-ink-600 bg-ink-900">
      <figcaption className="flex items-center gap-2 border-b border-ink-600 bg-ink-800 px-4 py-2 font-mono text-xs text-ink-400">
        <span className="size-2 rounded-full bg-brand-500" />
        laboratório · <span className="text-brand-300">encontre c₁, c₂ e n₀</span>
      </figcaption>

      {/* escolha da função */}
      <div className="flex flex-wrap gap-2 px-4 pt-4">
        {presets.map((q, i) => (
          <button
            key={i}
            aria-pressed={i === pi}
            onClick={() => reset(i)}
            className={`rounded-md border px-3 py-1 text-xs transition ${
              i === pi
                ? "border-brand-500 bg-brand-900 text-white"
                : "border-ink-600 text-ink-400 hover:text-ink-200"
            }`}
          >
            <Tex tex={`f=${q.fTex},\\; g=${q.gTex}`} />
          </button>
        ))}
      </div>

      <div className="px-4 pt-3">
        <Tex block tex={String.raw`c_1\, g(n) \;\le\; f(n) \;\le\; c_2\, g(n) \qquad \forall\, n \ge n_0`} />
      </div>

      {/* gráfico */}
      <div className="px-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Gráfico de f(n) entre c1·g(n) e c2·g(n)">
          <defs>
            <clipPath id={clipId}>
              <rect x={M.l} y={M.t} width={PW} height={PH} />
            </clipPath>
          </defs>

          <Axes xTicks={linearTicks(N, 6)} yTicks={linearTicks(yMax)} sx={sx} sy={sy}
            xLabel="n" yLabel="operações" />

          <g clipPath={`url(#${clipId})`}>
            {/* zona antes de n₀: não conta */}
            <rect x={M.l} y={M.t} width={Math.max(0, sx(n0) - M.l)} height={PH}
              style={{ fill: "var(--color-ink-950)" }} opacity={0.65} />
            <path d={linePath(xs, xs.map((n) => c2 * p.g(n)), sx, sy)}
              fill="none" stroke="#fbbf24" strokeWidth={2} strokeDasharray="6 4" />
            <path d={linePath(xs, xs.map((n) => c1 * p.g(n)), sx, sy)}
              fill="none" stroke="#34d399" strokeWidth={2} strokeDasharray="6 4" />
            <path d={linePath(xs, xs.map(p.f), sx, sy)}
              fill="none" stroke="#62a0ff" strokeWidth={3.5} strokeLinejoin="round" />
          </g>

          {/* linha do n₀ */}
          <line x1={sx(n0)} x2={sx(n0)} y1={M.t} y2={H - M.b}
            style={{ stroke: "var(--color-ink-200)" }} strokeDasharray="3 4" />
          <text x={sx(n0) + 6} y={M.t + 12} className="font-mono text-[11px]"
            style={{ fill: "var(--color-ink-200)" }}>n₀ = {n0}</text>
        </svg>

        <div className="flex flex-wrap gap-x-5 gap-y-1 px-3 pb-3 font-mono text-[11px] text-ink-400">
          <span><span style={{ color: "#62a0ff" }}>━</span> f(n)</span>
          <span><span style={{ color: "#fbbf24" }}>╍</span> c₂·g(n) (teto)</span>
          <span><span style={{ color: "#34d399" }}>╍</span> c₁·g(n) (piso)</span>
        </div>
      </div>

      {/* sliders */}
      <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-ink-600 bg-ink-800 px-4 py-3">
        <Slider label="c_1" value={c1} min={0.1} max={5} step={0.1} onChange={setC1} />
        <Slider label="c_2" value={c2} min={0.1} max={8} step={0.1} onChange={setC2} />
        <Slider label="n_0" value={n0} min={1} max={20} step={1} onChange={setN0} />
      </div>

      {/* veredito */}
      <div className="space-y-3 border-t border-ink-600 px-4 py-4">
        <div className="flex flex-wrap gap-3">
          <Verdict ok={upper} tex={`f(n) = O(${p.gTex})`} rule="f(n) ≤ c₂·g(n) para todo n ≥ n₀" />
          <Verdict ok={lower} tex={`f(n) = \\Omega(${p.gTex})`} rule="f(n) ≥ c₁·g(n) para todo n ≥ n₀" />
          <Verdict ok={upper && lower} tex={`f(n) = \\Theta(${p.gTex})`} rule="os dois ao mesmo tempo" />
        </div>
        <p className="text-sm text-ink-400">💡 {p.note}</p>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={showExample}
            className="rounded-md bg-brand-500 px-3 py-1.5 font-mono text-xs font-semibold text-white transition hover:bg-brand-600">
            Ver um exemplo que funciona
          </button>
          <button onClick={() => reset(pi)}
            className="rounded-md border border-ink-600 px-3 py-1.5 font-mono text-xs text-ink-200 transition hover:border-brand-500">
            Zerar
          </button>
          <span className="font-mono text-[11px] text-ink-400">
            verificação numérica de n₀ até {N} (intervalo do gráfico)
          </span>
        </div>
      </div>
    </figure>
  );
}