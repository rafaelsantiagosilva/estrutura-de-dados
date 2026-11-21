import { Link } from "react-router-dom";
import { Menu, Search } from "lucide-react";

export default function TopBar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center gap-3 border-b border-ink-600 bg-ink-950/80 px-4 backdrop-blur">
      {/* botão hambúrguer: só aparece no mobile */}
      <button
        onClick={onMenu}
        aria-label="Abrir menu"
        className="rounded-md p-2 text-ink-200 hover:bg-ink-700 lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      <Link to="/" className="flex items-center gap-2 font-mono font-bold text-white">
        <span className="grid size-7 place-items-center rounded-md bg-brand-500 text-sm shadow-glow">
          {"{}"}
        </span>
        estruturas<span className="text-brand-400">/dados</span>
      </Link>

      {/* busca: placeholder visual (Ctrl+K entra depois com cmdk) */}
      <button
        disabled
        title="Em breve"
        className="ml-auto hidden items-center gap-2 rounded-lg border border-ink-600 bg-ink-900 px-3 py-1.5 font-mono text-xs text-ink-400 sm:flex"
      >
        <Search className="size-3.5" />
        Buscar…
        <kbd className="rounded border border-ink-600 px-1.5">Ctrl K</kbd>
      </button>
    </header>
  );
}