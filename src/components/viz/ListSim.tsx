import { useId, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Sim } from "../../viz-data/types";
import SimShell from "./SimShell";
import { ptrColor, stateColor } from "./colors";
import {
  BOX, GAP, H_CIRCULAR, H_NORMAL, MAIN_Y, R, START_X,
  buildEdges, headPath, layout, ptrLabels, stubSide,
} from "./listGeometry";

export default function ListSim({ sim }: { sim: Sim }) {
  const arrowId = useId().replace(/:/g, "") + "-seta"; // id único por simulação
  const headLabel = sim.headLabel ?? "ini";
  const H = sim.circular ? H_CIRCULAR : H_NORMAL;
  const t = { duration: 0.5, ease: "easeInOut" as const };

  // largura do desenho: cabe o maior número de colunas de TODOS os frames
  const W = useMemo(() => {
    const cols = Math.max(
      ...sim.frames.map((fr) => Math.max(fr.nodes.length, ...fr.nodes.map((n) => (n.col ?? -1) + 1))),
    );
    return Math.max(620, START_X + cols * GAP + 40);
  }, [sim.frames]);

  return (
    <SimShell title={sim.title} code={sim.code} frames={sim.frames}>
      {(f) => {
        const { pos, chain } = layout(f);
        const labels = ptrLabels(f, pos, chain);
        const edges = buildEdges(f, pos, !!sim.doubly);
        const headD = headPath(f.head ? pos.get(f.head) : undefined);

        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full text-brand-400" role="img" aria-label={`Simulação de ${sim.title}`}>
            <defs>
              <marker id={arrowId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
              </marker>
            </defs>

            {/* caixa inicial + seta para o primeiro nó */}
            <rect x={BOX.x} y={MAIN_Y - BOX.h / 2} width={BOX.w} height={BOX.h} rx={6} strokeWidth={1.5}
              style={{ fill: "var(--color-ink-800)", stroke: "var(--color-brand-500)" }} />
            <text x={BOX.x + BOX.w / 2} y={MAIN_Y} dy="0.35em" textAnchor="middle"
              className="font-mono text-[13px] font-semibold" style={{ fill: "var(--color-brand-300)" }}>
              {headLabel}
            </text>
            {headD ? (
              <motion.path fill="none" stroke="currentColor" strokeWidth={2} markerEnd={`url(#${arrowId})`}
                initial={false} animate={{ d: headD }} transition={t} />
            ) : (
              <>
                <line x1={BOX.x + BOX.w + 2} y1={MAIN_Y} x2={94} y2={MAIN_Y}
                  stroke="currentColor" strokeWidth={2} markerEnd={`url(#${arrowId})`} />
                <text x={100} y={MAIN_Y} dy="0.35em" className="font-mono text-[12px]"
                  style={{ fill: "var(--color-ink-400)" }}>NULL</text>
              </>
            )}

            {/* ➡️ setas entre nós (prox sólida, prev tracejada) */}
            <AnimatePresence initial={false}>
              {edges.map((e) => (
                <motion.path key={e.key} fill="none" stroke="currentColor" strokeWidth={2}
                  strokeDasharray={e.kind === "prev" ? "5 4" : undefined}
                  markerEnd={`url(#${arrowId})`}
                  initial={{ opacity: 0, d: e.d }} animate={{ opacity: 1, d: e.d }}
                  exit={{ opacity: 0 }} transition={t} />
              ))}
            </AnimatePresence>

            {/* ⭕ nós */}
            <AnimatePresence initial={false}>
              {f.nodes.map((n) => {
                const { x, y } = pos.get(n.id)!;
                const color = n.state ? stateColor[n.state] : "var(--color-brand-500)";
                const side = n.next === null ? stubSide(n.id, pos) : null;
                return (
                  <motion.g key={n.id}
                    initial={{ opacity: 0, x, y }} animate={{ opacity: 1, x, y }}
                    exit={{ opacity: 0 }} transition={t}>
                    <motion.circle initial={{ r: 0 }} animate={{ r: R }} transition={t}
                      strokeWidth={n.state ? 3.5 : 2.5} style={{ fill: "var(--color-ink-800)", stroke: color }} />
                    <text dy="0.35em" textAnchor="middle" className="font-mono text-[15px] font-bold"
                      style={{ fill: "var(--color-ink-200)" }}>{n.value}</text>
                    {side === "right" && (
                      <>
                        <line x1={R + 2} y1={0} x2={R + 24} y2={0} stroke="currentColor" strokeWidth={2}
                          markerEnd={`url(#${arrowId})`} />
                        <text x={R + 30} dy="0.35em" className="font-mono text-[12px]"
                          style={{ fill: "var(--color-ink-400)" }}>NULL</text>
                      </>
                    )}
                    {side === "up" && (
                      <>
                        <line x1={0} y1={-R - 2} x2={0} y2={-R - 22} stroke="currentColor" strokeWidth={2}
                          markerEnd={`url(#${arrowId})`} />
                        <text y={-R - 32} textAnchor="middle" className="font-mono text-[12px]"
                          style={{ fill: "var(--color-ink-400)" }}>NULL</text>
                      </>
                    )}
                    {side === "down" && (
                      <>
                        <line x1={0} y1={R + 2} x2={0} y2={R + 22} stroke="currentColor" strokeWidth={2}
                          markerEnd={`url(#${arrowId})`} />
                        <text y={R + 34} textAnchor="middle" className="font-mono text-[12px]"
                          style={{ fill: "var(--color-ink-400)" }}>NULL</text>
                      </>
                    )}
                  </motion.g>
                );
              })}
            </AnimatePresence>

            {/* 🏷️ rótulos dos ponteiros */}
            <AnimatePresence initial={false}>
              {labels.map((l) => (
                <motion.g key={l.name}
                  initial={{ opacity: 0, x: l.x, y: l.y }} animate={{ opacity: 1, x: l.x, y: l.y }}
                  exit={{ opacity: 0 }} transition={t}>
                  <text textAnchor="middle" className="font-mono text-[13px] font-semibold"
                    style={{ fill: ptrColor[l.name] ?? "var(--color-brand-300)" }}>
                    {l.above ? "↓ " : "↑ "}{l.name}
                  </text>
                </motion.g>
              ))}
            </AnimatePresence>
          </svg>
        );
      }}
    </SimShell>
  );
}
