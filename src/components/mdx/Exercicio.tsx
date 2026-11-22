import { useState, type ReactNode } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDown, Eye, EyeOff } from "lucide-react";

type ExercicioProps = {
  numero: number | string;
  titulo: string;
  children: ReactNode;
};

/** Cartão do exercício: o enunciado fica visível; coloque um <Resposta> no final. */
export function Exercicio({ numero, titulo, children }: ExercicioProps) {
  return (
    <section
      id={`questao-${numero}`}
      className="my-10 scroll-mt-20 overflow-hidden rounded-card border border-ink-600 bg-ink-900"
    >
      <header className="not-prose flex items-center gap-3 border-b border-ink-600 bg-ink-800 px-5 py-3">
        <span className="grid h-7 min-w-7 place-items-center rounded-md bg-brand-500 px-2 font-mono text-xs font-bold text-white shadow-glow">
          {numero}
        </span>
        <h3 className="font-mono text-base font-semibold text-white">{titulo}</h3>
      </header>
      <div className="px-5 py-4 [&>:first-child]:mt-0 [&>:last-child]:mb-0">{children}</div>
    </section>
  );
}

/** Resposta escondida: só aparece (e só é montada) quando o aluno clica. */
export function Resposta({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className="mt-6 overflow-hidden rounded-lg border border-brand-500/40 bg-ink-950/40"
    >
      <Collapsible.Trigger className="group not-prose flex w-full items-center gap-2 px-4 py-3 text-left font-mono text-sm font-semibold text-brand-300 transition hover:bg-brand-900/40">
        {open ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        {open ? "Ocultar resposta" : "Ver resposta"}
        <ChevronDown className="ml-auto size-4 transition-transform group-data-[state=open]:rotate-180" />
      </Collapsible.Trigger>

      <Collapsible.Content className="collapsible-content">
        <div className="border-t border-brand-500/30 px-4 pb-4 pt-2 [&>:first-child]:mt-0 [&>:last-child]:mb-0">
          {children}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
