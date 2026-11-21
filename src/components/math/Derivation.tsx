import Tex from "./Tex";

type Step = { tex: string; note?: string };
type Props = { title: string; steps: Step[] };

export default function Derivation({ title, steps }: Props) {
  return (
    <section className="not-prose my-8 overflow-hidden rounded-card border border-ink-600 bg-ink-900">
      <header className="flex items-center gap-2 border-b border-ink-600 bg-ink-800 px-4 py-2 font-mono text-xs text-ink-400">
        <span className="size-2 rounded-full bg-brand-500" />
        cálculo · <span className="text-brand-300">{title}</span>
      </header>

      <ol>
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          return (
            <li
              key={i}
              className={`flex gap-4 border-b border-ink-700 px-4 py-3 last:border-b-0 ${
                last ? "bg-brand-900/40" : ""
              }`}
            >
              <span
                className={`mt-1 grid size-6 shrink-0 place-items-center rounded-full font-mono text-xs ${
                  last ? "bg-brand-500 text-white" : "bg-brand-900 text-brand-300"
                }`}
              >
                {last ? "✓" : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <Tex tex={s.tex} block />
                {s.note && <p className="mt-1 text-sm text-ink-400">{s.note}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}