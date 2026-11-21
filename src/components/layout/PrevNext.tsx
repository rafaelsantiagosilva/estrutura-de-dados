import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { flatPages } from "../../lib/nav";

const card =
  "flex flex-1 flex-col gap-1 rounded-card border border-ink-600 bg-ink-900 p-4 transition hover:border-brand-500 hover:bg-ink-800";

export default function PrevNext() {
  const { pathname } = useLocation();
  const i = flatPages.findIndex((p) => p.to === pathname);
  if (i === -1) return null;

  const prev = flatPages[i - 1];
  const next = flatPages[i + 1];

  return (
    <nav className="mt-16 flex gap-4" aria-label="Navegação entre páginas">
      {prev ? (
        <Link to={prev.to} className={card}>
          <span className="flex items-center gap-1 text-xs text-ink-400">
            <ArrowLeft className="size-3" /> Anterior
          </span>
          <span className="font-mono text-sm text-white">
            {prev.topic.title}: {prev.section.title}
          </span>
        </Link>
      ) : (
        <span className="flex-1" />
      )}

      {next ? (
        <Link to={next.to} className={`${card} items-end text-right`}>
          <span className="flex items-center gap-1 text-xs text-ink-400">
            Próximo <ArrowRight className="size-3" />
          </span>
          <span className="font-mono text-sm text-white">
            {next.topic.title}: {next.section.title}
          </span>
        </Link>
      ) : (
        <span className="flex-1" />
      )}
    </nav>
  );
}