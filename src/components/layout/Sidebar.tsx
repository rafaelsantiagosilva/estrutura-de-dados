import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import { nav } from "../../lib/nav";

type Props = { open: boolean; onClose: () => void };

export default function Sidebar({ open, onClose }: Props) {
  const { pathname } = useLocation();
  const activeTopic = pathname.split("/")[1]; // "/pilhas/exercicios" → "pilhas"

  // Escolhas manuais do usuário (abrir/fechar). Se ele nunca clicou,
  // o tema da página atual fica aberto automaticamente.
  const [manual, setManual] = useState<Record<string, boolean>>({});

  return (
    <>
      {/* fundo escuro atrás do menu no mobile */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-14 z-40 w-72 overflow-y-auto border-r border-ink-600 bg-ink-900 p-4 transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav aria-label="Conteúdo da aula">
          <p className="mb-3 px-2 font-mono text-xs uppercase tracking-widest text-ink-400">
            Conteúdo
          </p>

          <ul className="space-y-1">
            {nav.map((topic, idx) => {
              const isActive = topic.slug === activeTopic;
              const isOpen = manual[topic.slug] ?? isActive;
              const Icon = topic.icon;

              return (
                <li key={topic.slug}>
                  <Collapsible.Root
                    open={isOpen}
                    onOpenChange={(v) => setManual((m) => ({ ...m, [topic.slug]: v }))}
                  >
                    <Collapsible.Trigger
                      className={`group flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left font-mono text-sm transition-colors hover:bg-ink-700 ${
                        isActive ? "text-white" : "text-ink-200"
                      }`}
                    >
                      <span className="w-5 text-xs text-ink-400">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <Icon className={`size-4 ${isActive ? "text-brand-400" : "text-ink-400"}`} />
                      <span className="flex-1">{topic.title}</span>
                      <ChevronRight className="size-4 text-ink-400 transition-transform group-data-[state=open]:rotate-90" />
                    </Collapsible.Trigger>

                    <Collapsible.Content className="collapsible-content">
                      <ul className="ml-[1.35rem] mt-1 space-y-0.5 border-l border-ink-600 pb-2">
                        {topic.sections.map((s) => (
                          <li key={s.slug}>
                            <NavLink
                              to={`/${topic.slug}/${s.slug}`}
                              onClick={onClose}
                              className={({ isActive: on }) =>
                                `-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors ${
                                  on
                                    ? "border-brand-500 bg-brand-900/40 text-brand-300"
                                    : "border-transparent text-ink-400 hover:text-ink-200"
                                }`
                              }
                            >
                              {s.title}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </Collapsible.Content>
                  </Collapsible.Root>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}