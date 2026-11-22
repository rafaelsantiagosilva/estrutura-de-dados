import type { NodeState } from "../../viz-data/types";

export const stateColor: Record<NodeState, string> = {
    novo: "var(--color-ok)",
    visitando: "var(--color-warn)",
    removido: "var(--color-danger)",
    achado: "var(--color-ok)",
};

// cor do rótulo de cada marcador (ponteiro ou índice)
export const ptrColor: Record<string, string> = {
    aux: "var(--color-warn)",
    no: "var(--color-ok)",
    anterior: "var(--color-brand-300)",
    topo: "var(--color-brand-300)",
    ini: "var(--color-ok)",
    fim: "var(--color-warn)",
    i: "var(--color-warn)",
    max: "var(--color-ok)",
};