import type { NodeState, VizNode } from "../types";

const ids = "abcdefghij";

// makeList(3, 5, 8) → a(3) → b(5) → c(8) → NULL
export const makeList = (...values: number[]): VizNode[] =>
    values.map((value, i) => ({
        id: ids[i],
        value,
        next: i < values.length - 1 ? ids[i + 1] : null,
    }));

// devolve uma cópia dos nós com `changes` aplicado ao nó `id`
export const patch = (nodes: VizNode[], id: string, changes: Partial<VizNode>): VizNode[] =>
    nodes.map((n) => (n.id === id ? { ...n, ...changes } : n));

// pinta vários nós de uma vez: mark(lista, { b: "visitando" })
export const mark = (nodes: VizNode[], states: Record<string, NodeState>): VizNode[] =>
    nodes.map((n) => ({ ...n, state: states[n.id] ?? n.state }));