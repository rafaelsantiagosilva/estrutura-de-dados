import { AnimatePresence, motion } from "motion/react";
import type { ArrayFrame, ArraySimData } from "../../viz-data/types";
import SimShell from "./SimShell";
import { ptrColor, stateColor } from "./colors";

type Pt = { x: number; y: number };

/** Medidas e posição de cada célula, conforme a orientação. `slot(i)` = canto superior esquerdo. */
function geometry(sim: ArraySimData) {
  const n = sim.capacity;

  if (sim.orientation === "vertical") {
    const cw = 120, ch = 44, x0 = 150, y0 = 14;
    return {
      cw, ch, W: 380,
      H: y0 + (n + 1) * ch + 14, // +1 posição: espaço para o índice -1
      slot: (i: number): Pt => ({ x: x0, y: y0 + (n - 1 - i) * ch }), // 0 = embaixo
    };
  }

  const cw = 72, ch = 56, x0 = 96, y0 = 36;
  return {
    cw, ch,
    W: Math.max(520, x0 + n * cw + 24),
    H: y0 + ch + 24 + 3 * 20, // espaço para até 3 rótulos empilhados
    slot: (i: number): Pt => ({ x: x0 + i * cw, y: y0 }),
  };
}

type Geo = ReturnType<typeof geometry>;

/** Posição dos rótulos dos marcadores. Vários no mesmo índice são empilhados. */
function labels(f: ArrayFrame, g: Geo, vertical: boolean) {
  const stack = new Map<number, number>();
  return Object.entries(f.ptrs ?? {}).map(([name, idx]) => {
    const k = stack.get(idx) ?? 0;
    stack.set(idx, k + 1);
    const s = g.slot(idx);
    return vertical
      ? { name, idx, anchor: "end" as const, x: s.x - 14 - k * 72, y: s.y + g.ch / 2 }
      : { name, idx, anchor: "middle" as const, x: s.x + g.cw / 2, y: s.y + g.ch + 22 + k * 18 };
  });
}

export default function ArraySim({ sim }: { sim: ArraySimData }) {
  const g = geometry(sim);
  const vertical = sim.orientation === "vertical";
  const t = { duration: 0.5, ease: "easeInOut" as const };

  return (
    <SimShell title={sim.title} code={sim.code} frames={sim.frames}>
      {(f) => (
        <svg
          viewBox={`0 0 ${g.W} ${g.H}`}
          className={`w-full ${vertical ? "mx-auto max-w-md" : ""}`}
          role="img"
          aria-label={`Simulação de ${sim.title}`}
        >
          {/* 🟦 base da pilha */}
          {vertical && (
            <line
              x1={g.slot(0).x - 8} x2={g.slot(0).x + g.cw + 8}
              y1={g.slot(-1).y} y2={g.slot(-1).y}
              strokeWidth={3} strokeLinecap="round" style={{ stroke: "var(--color-ink-400)" }}
            />
          )}

          {/* 🧱 células */}
          {Array.from({ length: sim.capacity }, (_, i) => {
            const cell = f.cells[i] ?? null;
            const { x, y } = g.slot(i);

            // ⚠️ `cell` é null em posição vazia: sempre usar `cell?.`
            const apagada = cell?.state === "descartado";
            const color = cell?.state
              ? (stateColor[cell.state] ?? "var(--color-ink-400)")
              : cell
                ? "var(--color-brand-500)"
                : "var(--color-ink-600)";

            return (
              <g key={i} style={{ opacity: apagada ? 0.35 : 1, transition: "opacity 0.4s" }}>
                <rect
                  x={x} y={y} width={g.cw} height={g.ch} rx={8}
                  strokeWidth={cell?.state && !apagada ? 3.5 : 2.5}
                  strokeDasharray={cell ? undefined : "5 5"}
                  style={{ fill: "var(--color-ink-800)", stroke: color, transition: "stroke 0.3s" }}
                />

                {/* valor (aparece/some com fade) */}
                <AnimatePresence initial={false}>
                  {cell && (
                    <motion.text
                      key={String(cell.value)}
                      x={x + g.cw / 2} y={y + g.ch / 2} dy="0.35em" textAnchor="middle"
                      className="font-mono text-[16px] font-bold"
                      style={{ fill: "var(--color-ink-200)" }}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={t}
                    >
                      {cell.value}
                    </motion.text>
                  )}
                </AnimatePresence>

                {/* índice [i] */}
                <text
                  x={vertical ? x + g.cw + 10 : x + g.cw / 2}
                  y={vertical ? y + g.ch / 2 : y - 10}
                  dy={vertical ? "0.35em" : undefined}
                  textAnchor={vertical ? "start" : "middle"}
                  className="font-mono text-[12px]" style={{ fill: "var(--color-ink-400)" }}
                >
                  [{i}]
                </text>
              </g>
            );
          })}

          {/* 🏷️ marcadores (topo, ini, fim, meio...): deslizam de uma posição para outra */}
          <AnimatePresence initial={false}>
            {labels(f, g, vertical).map((l) => (
              <motion.g
                key={l.name}
                initial={{ opacity: 0, x: l.x, y: l.y }}
                animate={{ opacity: 1, x: l.x, y: l.y }}
                exit={{ opacity: 0 }}
                transition={t}
              >
                <text
                  textAnchor={l.anchor} dy="0.35em"
                  className="font-mono text-[13px] font-semibold"
                  style={{ fill: ptrColor[l.name] ?? "var(--color-brand-300)" }}
                >
                  {vertical ? `${l.name} →` : `↑ ${l.name}`}
                  {l.idx < 0 ? " (vazia)" : ""}
                </text>
              </motion.g>
            ))}
          </AnimatePresence>
        </svg>
      )}
    </SimShell>
  );
}