import { useMemo, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { RotateCcw } from "lucide-react";
import type { GraphData, GraphTone } from "../../viz-data/graphs";
import { toneColor } from "./colors";
import { R, degreeOf, describe, edgeGeometry, groupBox } from "./graphGeometry";

const HOT = "var(--color-brand-300)"; // destaque do nó sob o mouse e das suas arestas
const BASE_EDGE = "var(--color-brand-400)";
const BASE_NODE = "var(--color-brand-500)";

/** Transforma `texto` entre crases em <code>. */
function Caption({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((part, i) =>
        i % 2 ? (
          <code key={i} className="rounded bg-ink-800 px-1 text-brand-300">{part}</code>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export default function GraphViz({ graph: g }: { graph: GraphData }) {
  const reduce = useReducedMotion();
  const [run, setRun] = useState(0); // trocar a key do <svg> reinicia a animação
  const [hover, setHover] = useState<number | null>(null);
  const [sel, setSel] = useState<number | null>(null);
  const active = hover ?? sel;

  const dur = reduce ? 0 : 0.5;
  const d = (s: number) => (reduce ? 0 : s); // atrasos

  const pos = useMemo(() => new Map(g.nodes.map((n) => [n.id, n])), [g]);

  // tom herdado das molduras "pintadas" (componentes, por exemplo)
  const groupTone = useMemo(() => {
    const m = new Map<number, GraphTone>();
    g.groups?.forEach((gr) => gr.paint !== false && gr.ids.forEach((id) => m.set(id, gr.tone)));
    return m;
  }, [g]);

  const geos = useMemo(
    () => g.edges.map((e) => edgeGeometry(e, pos.get(e.from)!, pos.get(e.to)!, !!(g.directed || e.arrow))),
    [g, pos],
  );

  // quem é vizinho do nó ativo (para apagar o resto)
  const near = new Set<number>();
  if (active !== null) {
    g.edges.forEach((e) => {
      if (e.from === active) near.add(e.to);
      if (e.to === active) near.add(e.from);
    });
  }

  const toggle = (id: number) => setSel((s) => (s === id ? null : id));
  const onKey = (id: number) => (ev: KeyboardEvent) => {
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      toggle(id);
    }
  };

  const text = active !== null && g.info !== false ? describe(g, active) : g.caption;

  const chips: Record<string, string | number> = {
    ...(g.degrees ? Object.fromEntries(g.nodes.map((n) => [`grau(${n.label ?? n.id})`, degreeOf(g, n.id)])) : {}),
    ...g.vars,
  };

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-card border border-ink-600 bg-ink-900">
      <figcaption className="flex items-center gap-2 border-b border-ink-600 bg-ink-800 px-4 py-2 font-mono text-xs text-ink-400">
        <span className="size-2 rounded-full bg-brand-500" />
        grafo · <span className="text-brand-300">{g.title}</span>
        <span className="ml-auto hidden sm:inline">passe o mouse nos nós</span>
        <button
          onClick={() => setRun((r) => r + 1)}
          aria-label="Repetir animação"
          className="ml-2 grid size-6 place-items-center rounded-md border border-ink-600 bg-ink-800 text-ink-200 transition hover:border-brand-500 hover:text-white sm:ml-0"
        >
          <RotateCcw className="size-3.5" />
        </button>
      </figcaption>

      <div className="border-t border-ink-600 bg-ink-950/60 px-2 pt-2">
        <svg
          key={run}
          viewBox={`0 0 ${g.width} ${g.height}`}
          className="mx-auto w-full"
          style={{ maxWidth: g.width }}
          role="img"
          aria-label={`Grafo: ${g.title}`}
        >
          {/* 🟦 molduras (componentes, painéis) */}
          {g.groups?.map((gr) => {
            const b = groupBox(gr.ids.map((id) => pos.get(id)!));
            const c = toneColor[gr.tone];
            const w = gr.label.length * 8 + 16;
            return (
              <motion.g key={gr.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: d(0.5) }}>
                <rect
                  x={b.x} y={b.y} width={b.width} height={b.height} rx={18} strokeWidth={2} strokeDasharray="6 5"
                  style={{ fill: c, fillOpacity: 0.06, stroke: c, strokeOpacity: 0.7 }}
                />
                <rect x={b.x + 14} y={b.y - 10} width={w} height={20} rx={5} style={{ fill: "var(--color-ink-950)" }} />
                <text
                  x={b.x + 22} y={b.y} dy="0.35em"
                  className="font-mono text-[12px] font-semibold" style={{ fill: c }}
                >
                  {gr.label}
                </text>
              </motion.g>
            );
          })}

          {/* ➖ arestas (a linha é "desenhada"; a seta aparece no fim) */}
          {g.edges.map((e, i) => {
            const geo = geos[i];
            const hot = active !== null && (e.from === active || e.to === active);
            const dim = active !== null && !hot;
            const tone = e.tone ?? (groupTone.get(e.from) && groupTone.get(e.from) === groupTone.get(e.to) ? groupTone.get(e.from) : undefined);
            const color = hot ? HOT : tone ? toneColor[tone] : BASE_EDGE;
            const delay = d(e.delay ?? 0.3 + i * 0.06);

            return (
              <g key={i} style={{ opacity: dim ? 0.2 : 1, transition: "opacity 0.25s" }}>
                <motion.path
                  d={geo.d} fill="none" strokeLinecap="round"
                  strokeWidth={hot ? 3.5 : tone ? 3 : 2}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: dur, delay, ease: "easeInOut" }}
                  style={{ stroke: color }}
                />
                {geo.head && (
                  <motion.path
                    d={geo.head}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ duration: d(0.15), delay: delay + dur * 0.85 }}
                    style={{ fill: color }}
                  />
                )}
                {e.weight !== undefined && (
                  <motion.g
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ duration: d(0.3), delay: delay + dur * 0.5 }}
                  >
                    <rect
                      x={geo.label.x - (String(e.weight).length * 9 + 14) / 2} y={geo.label.y - 10}
                      width={String(e.weight).length * 9 + 14} height={20} rx={6} strokeWidth={1.5}
                      style={{ fill: "var(--color-ink-900)", stroke: "var(--color-ink-600)" }}
                    />
                    <text
                      x={geo.label.x} y={geo.label.y} dy="0.35em" textAnchor="middle"
                      className="font-mono text-[13px] font-bold" style={{ fill: "var(--color-warn)" }}
                    >
                      {e.weight}
                    </text>
                  </motion.g>
                )}
              </g>
            );
          })}

          {/* ⭕ nós */}
          {g.nodes.map((n, i) => {
            const isActive = active === n.id;
            const dim = active !== null && !isActive && !near.has(n.id);
            const tone = n.tone ?? groupTone.get(n.id);
            const color = isActive ? HOT : tone ? toneColor[tone] : BASE_NODE;
            const delay = d(i * 0.05);

            return (
              <g
                key={n.id}
                transform={`translate(${n.x} ${n.y})`}
                tabIndex={0} role="button" aria-label={`Nó ${n.label ?? n.id}`}
                className="outline-none"
                style={{ opacity: dim ? 0.3 : 1, transition: "opacity 0.25s", cursor: "pointer" }}
                onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(n.id)} onBlur={() => setHover(null)}
                onClick={() => toggle(n.id)} onKeyDown={onKey(n.id)}
              >
                {isActive && <circle r={R + 7} style={{ fill: HOT, fillOpacity: 0.2 }} />}
                <motion.circle
                  initial={{ r: 0 }} animate={{ r: R }} transition={{ duration: dur, delay }}
                  strokeWidth={tone || isActive ? 3.5 : 2.5}
                  style={{ fill: "var(--color-ink-800)", stroke: color }}
                />
                {tone && !isActive && (
                  <motion.circle
                    initial={{ r: 0 }} animate={{ r: R - 2 }} transition={{ duration: dur, delay }}
                    style={{ fill: toneColor[tone], fillOpacity: 0.18 }}
                  />
                )}
                <motion.text
                  dy="0.35em" textAnchor="middle" className="font-mono text-[15px] font-bold"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: d(0.3), delay: delay + d(0.2) }}
                  style={{ fill: "var(--color-ink-200)", pointerEvents: "none" }}
                >
                  {n.label ?? n.id}
                </motion.text>

                {g.degrees && (
                  <motion.g
                    transform="translate(19 -19)"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: d(0.3), delay: d(1) }}
                    style={{ pointerEvents: "none" }}
                  >
                    <circle r={10} strokeWidth={1.5} style={{ fill: "var(--color-ink-900)", stroke: "var(--color-warn)" }} />
                    <text dy="0.35em" textAnchor="middle" className="font-mono text-[11px] font-bold" style={{ fill: "var(--color-warn)" }}>
                      {degreeOf(g, n.id)}
                    </text>
                  </motion.g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* 💬 legenda + variáveis */}
      <div className="border-t border-ink-600 px-4 py-3">
        <p aria-live="polite" className="min-h-[2.75rem] font-mono text-sm leading-relaxed text-ink-200">
          <Caption text={text} />
        </p>

        {g.legend && (
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {g.legend.map((l) => (
              <span key={l.text} className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-200">
                <span className="size-2.5 rounded-full" style={{ background: toneColor[l.tone] }} />
                {l.text}
              </span>
            ))}
          </div>
        )}

        {Object.keys(chips).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(chips).map(([k, v]) => (
              <span key={k} className="rounded-md border border-ink-600 bg-ink-800 px-2 py-0.5 font-mono text-xs">
                <span className="text-ink-400">{k} = </span>
                <span className="text-warn">{v}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </figure>
  );
}