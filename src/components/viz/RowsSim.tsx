import { AnimatePresence, motion } from "motion/react";
import type { RowsFrame, RowsSimData } from "../../viz-data/types";
import SimShell from "./SimShell";
import { ptrColor, stateColor } from "./colors";

const CW = 60;          // largura da célula
const CH = 48;          // altura da célula
const X0 = 76;          // onde começam as células (à esquerda fica o nome do vetor)
const Y0 = 28;
const STEP = CH + 62;   // distância entre uma linha e a próxima (cabem marcadores embaixo)

function pointers(f: RowsFrame) {
  const out: { key: string; name: string; x: number; y: number }[] = [];
  f.rows.forEach((row, r) => {
    const stack = new Map<number, number>();
    Object.entries(row.ptrs ?? {}).forEach(([name, idx]) => {
      if (idx < 0 || idx >= row.cells.length) return; // marcador fora do vetor: não desenha
      const k = stack.get(idx) ?? 0;
      stack.set(idx, k + 1);
      out.push({
        key: `${row.label}-${name}`, name,
        x: X0 + idx * CW + CW / 2,
        y: Y0 + r * STEP + CH + 22 + k * 18,
      });
    });
  });
  return out;
}

export default function RowsSim({ sim }: { sim: RowsSimData }) {
  const maxCells = Math.max(...sim.frames.flatMap((f) => f.rows.map((r) => r.cells.length)));
  const nRows = Math.max(...sim.frames.map((f) => f.rows.length));
  const W = Math.max(520, X0 + maxCells * CW + 24);
  const H = Y0 + (nRows - 1) * STEP + CH + 62;
  const t = { duration: 0.5, ease: "easeInOut" as const };

  return (
    <SimShell title={sim.title} code={sim.code} frames={sim.frames}>
      {(f) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Simulação de ${sim.title}`}>
          {f.rows.map((row, r) => {
            const y = Y0 + r * STEP;
            return (
              <g key={row.label}>
                {/* nome do vetor */}
                <text x={X0 - 14} y={y + CH / 2} dy="0.35em" textAnchor="end"
                  className="font-mono text-[15px] font-bold" style={{ fill: "var(--color-brand-300)" }}>
                  {row.label}
                </text>

                {row.cells.map((cell, i) => {
                  const x = X0 + i * CW;
                  const apagada = cell?.state === "descartado";
                  const color = cell?.state
                    ? stateColor[cell.state]
                    : cell ? "var(--color-brand-500)" : "var(--color-ink-600)";
                  return (
                    <g key={i} style={{ opacity: apagada ? 0.35 : 1, transition: "opacity 0.4s" }}>
                      <rect x={x + 2} y={y} width={CW - 4} height={CH} rx={8}
                        strokeWidth={cell?.state && !apagada ? 3.5 : 2.5}
                        strokeDasharray={cell ? undefined : "5 5"}
                        style={{ fill: "var(--color-ink-800)", stroke: color, transition: "stroke 0.3s" }} />
                      <AnimatePresence initial={false}>
                        {cell && (
                          <motion.text key={String(cell.value)}
                            x={x + CW / 2} y={y + CH / 2} dy="0.35em" textAnchor="middle"
                            className="font-mono text-[16px] font-bold" style={{ fill: "var(--color-ink-200)" }}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={t}>
                            {cell.value}
                          </motion.text>
                        )}
                      </AnimatePresence>
                      <text x={x + CW / 2} y={y - 8} textAnchor="middle"
                        className="font-mono text-[11px]" style={{ fill: "var(--color-ink-400)" }}>
                        [{i}]
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* 🏷️ marcadores (top1, top2, top, i, topo...) */}
          <AnimatePresence initial={false}>
            {pointers(f).map((p) => (
              <motion.g key={p.key}
                initial={{ opacity: 0, x: p.x, y: p.y }} animate={{ opacity: 1, x: p.x, y: p.y }}
                exit={{ opacity: 0 }} transition={t}>
                <text textAnchor="middle" dy="0.35em" className="font-mono text-[13px] font-semibold"
                  style={{ fill: ptrColor[p.name] ?? "var(--color-brand-300)" }}>
                  ↑ {p.name}
                </text>
              </motion.g>
            ))}
          </AnimatePresence>
        </svg>
      )}
    </SimShell>
  );
}
