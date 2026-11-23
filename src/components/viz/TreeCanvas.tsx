import { useId } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { TreeFrame } from "../../viz-data/arvores/treeTypes";
import { ptrColor, stateColor } from "./colors";
import { HALF, layout, type Pt, type TreeDims } from "./treeLayout";

const t = { duration: 0.5, ease: "easeInOut" as const };
const f1 = (v: number) => v.toFixed(1);

/** Reta de a até b, encurtada em `s` no começo e `e` no fim. Formato único (M ... L ...) para o motion animar. */
function seg(a: Pt, b: Pt, s: number, e: number) {
  const d = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  const ux = (b.x - a.x) / d;
  const uy = (b.y - a.y) / d;
  return `M${f1(a.x + ux * s)} ${f1(a.y + uy * s)} L${f1(b.x - ux * e)} ${f1(b.y - uy * e)}`;
}

type Props = { frame: TreeFrame; dims: TreeDims; label: string };

export default function TreeCanvas({ frame, dims, label }: Props) {
  const arrowId = useId().replace(/:/g, "") + "-seta"; // id único por simulação
  const { pos } = layout(frame, dims.stageX);

  // ➡️ setas pai → filho
  const edges: { key: string; d: string }[] = [];
  for (const n of frame.nodes) {
    const a = pos.get(n.id);
    if (!a) continue;
    for (const side of ["esq", "dir"] as const) {
      const cid = n[side];
      const b = cid ? pos.get(cid) : undefined;
      if (b) edges.push({ key: `${n.id}-${side}`, d: seg(a, b, HALF + 2, HALF + 7) });
    }
  }

  // ⬜ ponteiros NULL destacados
  const holes = (frame.holes ?? []).flatMap((h) => {
    const p = pos.get(h.parent);
    if (!p) return [];
    const hx = p.x + (h.side === "esq" ? -28 : 28);
    const hy = p.y + 52;
    return [{ key: `${h.parent}-${h.side}`, p, hx, hy }];
  });

  // 🏷️ rótulos dos ponteiros (vários no mesmo nó são empilhados)
  const stack = new Map<string, number>();
  const labels = Object.entries(frame.ptrs ?? {}).flatMap(([name, target]) => {
    const p = target ? pos.get(target) : undefined;
    if (!target || !p) return [];
    const k = stack.get(target) ?? 0;
    stack.set(target, k + 1);
    return [{ name, x: p.x, y: p.y - HALF - 12 - k * 16 }];
  });

  return (
    <svg viewBox={`0 0 ${dims.W} ${dims.H}`} className="w-full text-brand-400" role="img" aria-label={`Simulação de ${label}`}>
      <defs>
        <marker id={arrowId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
        </marker>
      </defs>

      {/* ➡️ setas */}
      <AnimatePresence initial={false}>
        {edges.map((e) => (
          <motion.path
            key={e.key} fill="none" stroke="currentColor" strokeWidth={2} markerEnd={`url(#${arrowId})`}
            initial={{ opacity: 0, d: e.d }} animate={{ opacity: 1, d: e.d }} exit={{ opacity: 0 }} transition={t}
          />
        ))}
      </AnimatePresence>

      {/* ⬜ NULL destacado */}
      <AnimatePresence initial={false}>
        {holes.map((h) => (
          <motion.g key={h.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={t}>
            <line
              x1={h.p.x} y1={h.p.y + HALF + 2} x2={h.hx} y2={h.hy - 9}
              stroke="currentColor" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.6}
            />
            <rect
              x={h.hx - 9} y={h.hy - 9} width={18} height={18} rx={4} strokeWidth={1.5} strokeDasharray="4 3"
              style={{ fill: "none", stroke: "var(--color-warn)" }}
            />
            <text x={h.hx} y={h.hy + 24} textAnchor="middle" className="font-mono text-[11px]" style={{ fill: "var(--color-warn)" }}>
              NULL
            </text>
          </motion.g>
        ))}
      </AnimatePresence>

      {/* ⬛ nós */}
      <AnimatePresence initial={false}>
        {frame.nodes.map((n) => {
          const p = pos.get(n.id);
          if (!p) return null;
          const color = n.state ? (stateColor[n.state] ?? "var(--color-ink-400)") : "var(--color-brand-500)";
          return (
            <motion.g
              key={n.id}
              initial={{ opacity: 0, x: p.x, y: p.y }} animate={{ opacity: 1, x: p.x, y: p.y }}
              exit={{ opacity: 0 }} transition={t}
            >
              <rect
                x={-HALF} y={-HALF} width={2 * HALF} height={2 * HALF} rx={6}
                strokeWidth={n.state ? 3.5 : 2.5}
                style={{ fill: "var(--color-ink-800)", stroke: color, transition: "stroke 0.3s" }}
              />
              <text dy="0.35em" textAnchor="middle" className="font-mono text-[15px] font-bold" style={{ fill: "var(--color-ink-200)" }}>
                {n.value}
              </text>
            </motion.g>
          );
        })}
      </AnimatePresence>

      {/* 🏷️ rótulos */}
      <AnimatePresence initial={false}>
        {labels.map((l) => (
          <motion.g
            key={l.name}
            initial={{ opacity: 0, x: l.x, y: l.y }} animate={{ opacity: 1, x: l.x, y: l.y }}
            exit={{ opacity: 0 }} transition={t}
          >
            <text textAnchor="middle" className="font-mono text-[13px] font-semibold" style={{ fill: ptrColor[l.name] ?? "var(--color-brand-300)" }}>
              ↓ {l.name}
            </text>
          </motion.g>
        ))}
      </AnimatePresence>
    </svg>
  );
}