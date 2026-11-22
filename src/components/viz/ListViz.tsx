import { motion } from "motion/react";
import type { Frame, NodeState } from "../../viz-data/types";
import { usePlayer } from "./usePlayer";

const R = 24, GAP = 110;

function layout(f: Frame) {
  const pos = new Map<string, { x: number; y: number }>();
  const seen = new Set<string>();
  let cur = f.head, k = 0;
  while (cur && !seen.has(cur)) {            // trava contra ciclos
    seen.add(cur);
    pos.set(cur, { x: 70 + k++ * GAP, y: 120 });
    cur = f.nodes.find((n) => n.id === cur)?.next ?? null;
  }
  f.nodes.filter((n) => !pos.has(n.id))      // nós soltos ficam acima
    .forEach((n, j) => pos.set(n.id, { x: 70 + j * GAP, y: 40 }));
  return pos;
}

const fill: Record<NodeState, string> = {
  novo: "var(--color-ok)",
  visitando: "var(--color-warn)",
  removido: "var(--color-danger)",
  achado: "var(--color-brand-400)", // escolha a cor que preferir
};

export function ListViz({ frames }: { frames: Frame[] }) {
  const p = usePlayer(frames);
  const pos = layout(p.frame);

  return (
    <figure className="my-6 rounded-card border border-ink-600 bg-ink-900 p-4">
      <svg viewBox="0 0 700 180" className="w-full text-brand-400">
        <defs>
          <marker id="seta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
          </marker>
        </defs>

        {p.frame.nodes.map((n) => {
          const a = pos.get(n.id)!, b = n.next ? pos.get(n.next) : null;
          return b && (
            <motion.line key={`s-${n.id}`} stroke="currentColor" strokeWidth={2} markerEnd="url(#seta)"
              initial={false}
              animate={{ x1: a.x + R, y1: a.y, x2: b.x - R - 4, y2: b.y }} />
          );
        })}

        {p.frame.nodes.map((n) => (
          <motion.g key={n.id} initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, x: pos.get(n.id)!.x, y: pos.get(n.id)!.y }}>
            <circle r={R} fill="var(--color-ink-800)" stroke={n.state ? fill[n.state] : "var(--color-brand-500)"} strokeWidth={2.5} />
            <text textAnchor="middle" dy="0.35em" fill="var(--color-ink-200)" className="font-mono text-sm">{n.value}</text>
          </motion.g>
        ))}
      </svg>

      <figcaption className="font-mono text-sm text-ink-200">{p.frame.caption}</figcaption>
      <div className="mt-3 flex gap-2">
        <button onClick={p.prev}>⏮</button>
        <button onClick={p.playing ? p.pause : p.play}>{p.playing ? "⏸" : "▶"}</button>
        <button onClick={p.next}>⏭</button>
        <button onClick={p.reset}>↺</button>
        <span className="ml-auto text-ink-400">{p.i + 1}/{p.total}</span>
      </div>
    </figure>
  );
}