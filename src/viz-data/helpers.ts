import type { Cell, NodeState, VizNode } from "./types";

const ids = "abcdefghij";

/* ───────── 🔗 Listas ───────── */

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

/* ───────── 🧮 Vetores ───────── */

// makeCells(4, 7, null, null, null) → [4, 7, vazio, vazio, vazio]
export const makeCells = (...values: (number | string | null)[]): (Cell | null)[] =>
    values.map((v) => (v === null ? null : { value: v }));

// putCell(cells, 2, { value: 9, state: "novo" }) → troca a posição 2
export const putCell = (cells: (Cell | null)[], i: number, cell: Cell | null) =>
    cells.map((c, k) => (k === i ? cell : c));

// markCell(cells, 2, "removido") → pinta a posição 2 (se não estiver vazia)
export const markCell = (cells: (Cell | null)[], i: number, state: NodeState) =>
    cells.map((c, k) => (k === i && c ? { ...c, state } : c));