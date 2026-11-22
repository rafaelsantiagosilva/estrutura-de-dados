import type { NodeState } from "../../viz-data/types";

export const stateColor: Record<NodeState, string> = {
    novo: "var(--color-ok)",
    visitando: "var(--color-warn)",
    removido: "var(--color-danger)",
    achado: "var(--color-ok)",
    descartado: "var(--color-ink-400)", // já conferido / eliminado: aparece apagado
};

// cor do rótulo de cada marcador (ponteiro ou índice). Sem entrada aqui = azul claro.
export const ptrColor: Record<string, string> = {
    // listas
    aux: "var(--color-warn)",
    no: "var(--color-ok)",
    anterior: "var(--color-brand-300)",
    atual: "var(--color-warn)",
    proximo: "var(--color-ok)",
    ant: "var(--color-brand-300)",
    ultimo: "var(--color-brand-300)",
    lixo: "var(--color-danger)",
    lento: "var(--color-warn)",
    rapido: "var(--color-danger)",
    ordenada: "var(--color-ok)",
    get: "var(--color-warn)",
    "li2->ini": "var(--color-ok)",
    // pilhas, filas e vetores
    topo: "var(--color-brand-300)",
    ini: "var(--color-ok)",
    fim: "var(--color-warn)",
    i: "var(--color-warn)",
    max: "var(--color-ok)",
    idx: "var(--color-brand-300)",
    meio: "var(--color-brand-400)",
};
