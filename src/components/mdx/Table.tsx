import type { ComponentProps } from "react";

// Envolve a tabela para rolar na horizontal em telas pequenas
export default function Table(props: ComponentProps<"table">) {
  return (
    <div className="px-2 my-6 overflow-x-auto rounded-card border border-ink-600">
      <table {...props} className="my-0" />
    </div>
  );
}