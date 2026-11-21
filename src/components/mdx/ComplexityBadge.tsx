import type { ReactNode } from "react";

// Uso no MDX: <ComplexityBadge>Θ(n)</ComplexityBadge>
export default function ComplexityBadge({ children }: { children: ReactNode }) {
  return (
    <span className="mx-0.5 inline-block rounded-md border border-brand-500/50 bg-brand-900 px-2 py-0.5 font-mono text-sm font-semibold text-brand-300">
      {children}
    </span>
  );
}