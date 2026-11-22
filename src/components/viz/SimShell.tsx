import { useMemo, useState, type ReactNode } from "react";
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { usePlayer } from "./usePlayer";
import CodePanel from "./CodePanel";

// O mínimo que TODO frame precisa ter (lista, vetor, árvore...)
type BaseFrame = {
  line?: number;
  caption: string;
  vars?: Record<string, string | number>;
};

type Props<F extends BaseFrame> = {
  title: string;
  code: string;
  frames: F[];
  children: (frame: F) => ReactNode; // ← o desenho de UM frame
};

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

export default function SimShell<F extends BaseFrame>({ title, code, frames, children }: Props<F>) {
  const [mult, setMult] = useState(1);
  const p = usePlayer(frames.length, 1400 / mult);
  const f = frames[p.i];

  // variáveis acumulam: o que apareceu antes continua visível
  const vars = useMemo(
    () =>
      frames
        .slice(0, p.i + 1)
        .reduce<Record<string, string | number>>((acc, fr) => ({ ...acc, ...fr.vars }), {}),
    [frames, p.i],
  );

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-card border border-ink-600 bg-ink-900">
      <figcaption className="flex items-center gap-2 border-b border-ink-600 bg-ink-800 px-4 py-2 font-mono text-xs text-ink-400">
        <span className="size-2 rounded-full bg-brand-500" />
        simulação · <span className="text-brand-300">{title}</span>
      </figcaption>

      {/* 💻 código com a linha atual destacada */}
      <CodePanel code={code} activeLine={f.line} />

      {/* 🎨 desenho: quem decide é o ListSim / ArraySim */}
      <div className="border-t border-ink-600 bg-ink-950/60 px-2 pt-2">{children(f)}</div>

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

        <input
          type="range" min={0} max={frames.length - 1} value={p.i}
          onChange={(e) => p.goTo(Number(e.target.value))}
          aria-label="Passo da simulação" className="mx-2 min-w-24 flex-1 accent-brand-500"
        />

        <select
          value={mult} onChange={(e) => setMult(Number(e.target.value))} aria-label="Velocidade"
          className="rounded-md border border-ink-600 bg-ink-900 px-2 py-1 font-mono text-xs text-ink-200"
        >
          <option value={0.5}>0.5×</option>
          <option value={1}>1×</option>
          <option value={2}>2×</option>
        </select>
        <span className="font-mono text-xs text-ink-400">{p.i + 1}/{frames.length}</span>
      </div>
    </figure>
  );
}