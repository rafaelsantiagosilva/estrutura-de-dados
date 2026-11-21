import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { nav } from "../lib/nav";

export default function HomePage() {
  return (
    <div>
      <section className="py-10">
        <p className="font-mono text-sm text-brand-400">$ ./aula --start</p>
        <h1 className="mt-4 font-mono text-4xl font-bold leading-tight text-white sm:text-5xl">
          Estruturas de Dados,
          <br />
          <span className="text-brand-500">visualizadas</span>.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-400">
          Do básico de C até árvores, com explicações simples e animações passo a passo
          para você ver cada ponteiro se movendo.
        </p>
        <Link
          to="/listas-encadeadas/explicacao"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 font-mono text-sm font-semibold text-white shadow-glow transition hover:bg-brand-600"
        >
          Começar pelas listas <ArrowRight className="size-4" />
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {nav.map((t, i) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.slug}
              to={`/${t.slug}/${t.sections[0].slug}`}
              className="group rounded-card border border-ink-600 bg-ink-900 p-5 transition hover:border-brand-500 hover:bg-ink-800"
            >
              <div className="flex items-center justify-between">
                <Icon className="size-5 text-brand-400" />
                <span className="font-mono text-xs text-ink-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h2 className="mt-3 font-mono text-lg font-semibold text-white">{t.title}</h2>
              <p className="mt-1 text-sm text-ink-400">{t.description}</p>
            </Link>
          );
        })}
      </section>
    </div>
  );
}