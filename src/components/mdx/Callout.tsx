import type { ReactNode } from "react";
import { Info } from "lucide-react";

// Usado no lugar de <blockquote>: todo "> texto" do Markdown vira isto
export default function Callout({ children }: { children?: ReactNode }) {
  return (
    <aside className="not-prose my-6 flex gap-3 rounded-card border border-brand-500/40 bg-brand-900/40 p-4 text-ink-200">
      <Info className="mt-0.5 size-5 shrink-0 text-brand-400" aria-hidden />
      <div className="space-y-2">{children}</div>
    </aside>
  );
}