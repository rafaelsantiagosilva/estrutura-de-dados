import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import type { Frame, NodeState, Sim } from "../../viz-data/types";
import { usePlayer } from "./usePlayer";
import CodePanel from "./CodePanel";

// ───── medidas do desenho (em unidades do SVG) ─────
const R = 24;        // raio do nó
const GAP = 100;     // distância entre nós
const START_X = 130; // x do primeiro nó
const MAIN_Y = 150;  // linha principal (a lista)
const LOOSE_Y = 56;  // linha de cima (nós soltos)
const H = 240;

type Pt = { x: number; y: number };

const stateColor: Record<NodeState, string> = {
  novo: "var(--color-ok)",
  visitando: "var(--color-warn)",
  removido: "var(--color-danger)",
  achado: "var(--color-ok)",
};
const ptrColor: Record<string, string> = {
  aux: "var(--color-warn)",
  no: "var(--color-ok)",
  anterior: "var(--color-brand-300)",
};

/** Decide ONDE cada nó fica: quem é alcançável a partir de `ini` vai em fila; o resto fica em cima. */
function layout(f: Frame) {
  const pos = new Map<string, Pt>();
  const chain: string[] = [];

  let cur = f.head;
  while (cur && !pos.has(cur)) {            // `!pos.has` protege contra ciclos
    pos.set(cur, { x: START_X + chain.length * GAP, y: MAIN_Y });
    chain.push(cur);
    const id = cur;
    cur = f.nodes.find((n) => n.id === id)?.next ?? null;
  }

  let slot = 0;
  for (const n of f.nodes) {
    if (pos.has(n.id)) continue;
    // nó solto: fica acima do "buraco" antes do nó para o qual aponta
    const target = n.next ? pos.get(n.next) : undefined;
    pos.set(n.id, { x: target ? target.x - GAP / 2 : START_X + slot++ * GAP, y: LOOSE_Y });
  }
  return { pos, chain };
}

/** Seta que sai da borda de um círculo e chega na borda do outro. */
function edge(a: Pt, b: Pt) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const d = Math.hypot(dx, dy) || 1;
  return {
    x1: a.x + (dx / d) * R, y1: a.y + (dy / d) * R,
    x2: b.x - (dx / d) * (R + 5), y2: b.y - (dy / d) * (R + 5),
  };
}

/** Posição dos rótulos de ponteiros (aux, no, anterior...). Vários no mesmo nó são empilhados. */
function ptrLabels(f: Frame, pos: Map<string, Pt>, chain: string[]) {
  const stack = new Map<string, number>();
  return Object.entries(f.ptrs ?? {}).flatMap(([name, target]) => {
    let base: Pt, key: string;
    if (target === null) {
      // aponta para NULL: fica depois do último nó da cadeia
      const last = chain.length ? pos.get(chain[chain.length - 1])! : { x: START_X - 70, y: MAIN_Y };
      base = { x: last.x + 70, y: MAIN_Y };
      key = "NULL";
    } else {
      const p = pos.get(target);
      if (!p) return [];
      base = p;
      key = target;
    }
    const k = stack.get(key) ?? 0;
    stack.set(key, k + 1);
    const above = base.y < MAIN_Y; // nó solto → rótulo em cima
    return [{
      name, above,
      x: base.x,
      y: above ? base.y - R - 14 - k * 20 : base.y + R + 20 + k * 20,
    }];
  });
}

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

const btn =
  "grid size-8 place-items-center rounded-md border border-ink-600 bg-ink-800 text-ink-200 transition hover:border-brand-500 hover:text-white disabled:pointer-events-none disabled:opacity-40";

export default function ListSim({ sim }: { sim: Sim }) {
  const { frames } = sim;
  const [mult, setMult] = useState(1);
  const p = usePlayer(frames.length, 1400 / mult);
  const f = frames[p.i];
  const arrowId = useId().replace(/:/g, "") + "-seta"; // id único por simulação

  // largura do desenho: cabe o maior número de nós de TODOS os frames
  const W = useMemo(() => {
    const max = Math.max(...frames.map((fr) => fr.nodes.length));
    return Math.max(620, START_X + max * GAP + 40);
  }, [frames]);

  // variáveis acumulam: o que apareceu antes continua visível
  const vars = useMemo(
    () => frames.slice(0, p.i + 1).reduce<Record<string, string | number>>((acc, fr) => ({ ...acc, ...fr.vars }), {}),
    [frames, p.i],
  );

  const { pos, chain } = layout(f);
  const labels = ptrLabels(f, pos, chain);
  const t = { duration: 0.5, ease: "easeInOut" as const };

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-card border border-ink-600 bg-ink-900">
      <figcaption className="flex items-center gap-2 border-b border-ink-600 bg-ink-800 px-4 py-2 font-mono text-xs text-ink-400">
        <span className="size-2 rounded-full bg-brand-500" />
        simulação · <span className="text-brand-300">{sim.title}</span>
      </figcaption>

      {/* 💻 código com a linha atual destacada */}
      <CodePanel code={sim.code} activeLine={f.line} />

      {/* 🎨 desenho */}
      <div className="border-t border-ink-600 bg-ink-950/60 px-2 pt-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full text-brand-400" role="img" aria-label={`Simulação de ${sim.title}`}>
          <defs>
            <marker id={arrowId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
            </marker>
          </defs>

          {/* caixa `ini` + seta para o primeiro nó */}
          <rect x={14} y={MAIN_Y - 14} width={50} height={28} rx={6} strokeWidth={1.5}
            style={{ fill: "var(--color-ink-800)", stroke: "var(--color-brand-500)" }} />
          <text x={39} y={MAIN_Y} dy="0.35em" textAnchor="middle"
            className="font-mono text-[13px] font-semibold" style={{ fill: "var(--color-brand-300)" }}>ini</text>
          <line x1={66} y1={MAIN_Y} x2={f.head ? START_X - R - 5 : 94} y2={MAIN_Y}
            stroke="currentColor" strokeWidth={2} markerEnd={`url(#${arrowId})`} />
          {!f.head && (
            <text x={100} y={MAIN_Y} dy="0.35em" className="font-mono text-[12px]"
              style={{ fill: "var(--color-ink-400)" }}>NULL</text>
          )}

          {/* ➡️ setas entre nós (animam quando `next` muda) */}
          <AnimatePresence initial={false}>
            {f.nodes.filter((n) => n.next && pos.has(n.next)).map((n) => {
              const e = edge(pos.get(n.id)!, pos.get(n.next!)!);
              return (
                <motion.line key={n.id} stroke="currentColor" strokeWidth={2}
                  markerEnd={`url(#${arrowId})`}
                  initial={{ opacity: 0, ...e }} animate={{ opacity: 1, ...e }}
                  exit={{ opacity: 0 }} transition={t} />
              );
            })}
          </AnimatePresence>

          {/* ⭕ nós */}
          <AnimatePresence initial={false}>
            {f.nodes.map((n) => {
              const { x, y } = pos.get(n.id)!;
              const color = n.state ? stateColor[n.state] : "var(--color-brand-500)";
              return (
                <motion.g key={n.id}
                  initial={{ opacity: 0, x, y }} animate={{ opacity: 1, x, y }}
                  exit={{ opacity: 0 }} transition={t}>
                  <motion.circle initial={{ r: 0 }} animate={{ r: R }} transition={t}
                    strokeWidth={n.state ? 3.5 : 2.5} style={{ fill: "var(--color-ink-800)", stroke: color }} />
                  <text dy="0.35em" textAnchor="middle" className="font-mono text-[15px] font-bold"
                    style={{ fill: "var(--color-ink-200)" }}>{n.value}</text>
                  {n.next === null && (
                    <>
                      <line x1={R + 2} y1={0} x2={R + 24} y2={0} stroke="currentColor" strokeWidth={2}
                        markerEnd={`url(#${arrowId})`} />
                      <text x={R + 30} dy="0.35em" className="font-mono text-[12px]"
                        style={{ fill: "var(--color-ink-400)" }}>NULL</text>
                    </>
                  )}
                </motion.g>
              );
            })}
          </AnimatePresence>

          {/* 🏷️ rótulos dos ponteiros (deslizam de um nó para outro) */}
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
      </div>

      {/* 💬 legenda + variáveis */}
      <div className="border-t border-ink-600 px-4 py-3">
        <p aria-live="polite" className="min-h-[2.75rem] font-mono text-sm leading-relaxed text-ink-200">
          <Caption text={f.caption} />
        </p>
        {Object.keys(vars).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(vars).map(([k, v]) => (
              <span key={k} className="rounded-md border border-ink-600 bg-ink-800 px-2 py-0.5 font-mono text-xs">
                <span className="text-ink-400">{k} = </span>
                <span className="text-warn">{v}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 🎛️ controles */}
      <div className="flex flex-wrap items-center gap-2 border-t border-ink-600 bg-ink-800 px-4 py-3">
        <button className={btn} onClick={p.prev} disabled={p.i === 0} aria-label="Passo anterior">
          <SkipBack className="size-4" />
        </button>
        <button
          onClick={p.playing ? p.pause : p.play}
          aria-label={p.playing ? "Pausar" : "Reproduzir"}
          className="grid size-8 place-items-center rounded-md bg-brand-500 text-white shadow-glow transition hover:bg-brand-600"
        >
          {p.playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>
        <button className={btn} onClick={p.next} disabled={p.i === frames.length - 1} aria-label="Próximo passo">
          <SkipForward className="size-4" />
        </button>
        <button className={btn} onClick={p.reset} aria-label="Reiniciar">
          <RotateCcw className="size-4" />
        </button>

        <input type="range" min={0} max={frames.length - 1} value={p.i}
          onChange={(e) => p.goTo(Number(e.target.value))}
          aria-label="Passo da simulação" className="mx-2 min-w-24 flex-1 accent-brand-500" />

        <select value={mult} onChange={(e) => setMult(Number(e.target.value))} aria-label="Velocidade"
          className="rounded-md border border-ink-600 bg-ink-900 px-2 py-1 font-mono text-xs text-ink-200">
          <option value={0.5}>0.5×</option>
          <option value={1}>1×</option>
          <option value={2}>2×</option>
        </select>
        <span className="font-mono text-xs text-ink-400">{p.i + 1}/{frames.length}</span>
      </div>
    </figure>
  );
}