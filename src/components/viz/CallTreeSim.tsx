import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { CallTreeSimData } from "../../viz-data/types";
import SimShell from "./SimShell";
import { stateColor } from "./colors";

const CW = 48;      // largura reservada para cada posição do vetor
const CH = 34;      // altura da célula
const STEP = 66;    // distância vertical entre níveis da árvore
const PAD = 24;
const TOP = 14;

export default function CallTreeSim({ sim }: { sim: CallTreeSimData }) {
  const W = Math.max(520, PAD * 2 + sim.n * CW);
  const x0 = (W - sim.n * CW) / 2; // centraliza o vetor
  const maxDepth = useMemo(
    () => Math.max(...sim.frames.flatMap((f) => f.nodes.map((n) => n.depth))),
    [sim.frames],
  );
  const H = TOP + (maxDepth + 1) * STEP + 4;
  const t = { duration: 0.45, ease: "easeInOut" as const };

  return (
    <SimShell title={sim.title} code={sim.code} frames={sim.frames}>
      {(f) => {
        const byId = new Map(f.nodes.map((n) => [n.id, n] as const));
        const cx = (lo: number, hi: number) => x0 + ((lo + hi + 1) / 2) * CW;
        const ny = (d: number) => TOP + d * STEP;

        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Árvore de chamadas de ${sim.title}`}>
            {/* linhas pai → filho */}
            <AnimatePresence initial={false}>
              {f.nodes.filter((n) => n.parent && byId.has(n.parent)).map((n) => {
                const p = byId.get(n.parent!)!;
                return (
                  <motion.line key={`l-${n.id}`}
                    x1={cx(p.lo, p.hi)} y1={ny(p.depth) + CH + 8}
                    x2={cx(n.lo, n.hi)} y2={ny(n.depth)}
                    strokeWidth={1.5} style={{ stroke: "var(--color-ink-400)" }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={t} />
                );
              })}
            </AnimatePresence>

            {/* nós: cada um é um pedaço do vetor */}
            <AnimatePresence initial={false}>
              {f.nodes.map((n) => {
                const len = n.hi - n.lo + 1;
                const x = x0 + n.lo * CW;
                const y = ny(n.depth);
                const border = n.state ? stateColor[n.state] : "var(--color-brand-500)";
                return (
                  <motion.g key={n.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={t}>
                    <rect x={x + 1} y={y} width={len * CW - 2} height={CH + 8} rx={9}
                      strokeWidth={n.state ? 3.5 : 2}
                      style={{ fill: "var(--color-ink-800)", stroke: border, transition: "stroke 0.3s" }} />
                    {n.values.map((v, k) => {
                      const abs = n.lo + k;
                      const cs = n.cellStates?.[abs];
                      return (
                        <g key={k}>
                          {cs && (
                            <rect x={x + k * CW + 5} y={y + 4} width={CW - 10} height={CH} rx={6}
                              strokeWidth={2.5} style={{ fill: "transparent", stroke: stateColor[cs] }} />
                          )}
                          <AnimatePresence initial={false}>
                            <motion.text key={v}
                              x={x + k * CW + CW / 2} y={y + 4 + CH / 2} dy="0.35em" textAnchor="middle"
                              className="font-mono text-[15px] font-bold" style={{ fill: "var(--color-ink-200)" }}
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={t}>
                              {v}
                            </motion.text>
                          </AnimatePresence>
                        </g>
                      );
                    })}
                  </motion.g>
                );
              })}
            </AnimatePresence>
          </svg>
        );
      }}
    </SimShell>
  );
}
