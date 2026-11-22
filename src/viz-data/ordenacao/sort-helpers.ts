import type { ArrayFrame, Cell, NodeState } from "../types";

export type Marks = Record<number, NodeState>;

// pinta a posição i (ignora índices negativos)
export const at = (i: number, s: NodeState): Marks => (i >= 0 ? { [i]: s } : {});

// marcador só existe se o índice for válido
export const ptr = (name: string, idx: number): Record<string, number> =>
    idx >= 0 ? { [name]: idx } : {};

/**
 * Grava frames a partir do vetor `v`, que o gerador vai alterando.
 * Cada `add` tira uma "fotografia" do vetor naquele instante.
 * Posições >= doneFrom aparecem em verde (já estão no lugar final).
 */
export function createRecorder(v: number[]) {
    const frames: ArrayFrame[] = [];
    let doneFrom = v.length;

    return {
        frames,
        setDone(i: number) {
            doneFrom = i;
        },
        add(
            line: number,
            caption: string,
            ptrs: Record<string, number>,
            vars: Record<string, string | number>,
            marks: Marks = {},
        ) {
            const cells: Cell[] = v.map((value, k) => ({
                value,
                state: marks[k] ?? (k >= doneFrom ? "achado" : undefined),
            }));
            frames.push({ cells, ptrs, vars, line, caption });
        },
    };
}