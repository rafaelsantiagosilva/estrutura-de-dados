// src/viz-data/addInicio.ts
import type { Frame } from "./types";

const base = [
    { id: "a", value: 3, next: "b" },
    { id: "b", value: 5, next: null },
];

export const addInicioFrames: Frame[] = [
    { nodes: base, head: "a", ptrs: {}, caption: "Lista inicial: [3, 5]" },
    {
        nodes: [...base, { id: "n", value: 7, next: null, state: "novo" }],
        head: "a", ptrs: {}, line: 3, caption: "newNo(7) cria um nó solto na memória"
    },
    {
        nodes: [...base, { id: "n", value: 7, next: "a", state: "novo" }],
        head: "a", ptrs: {}, line: 5, caption: "O novo nó aponta para quem era o primeiro"
    },
    {
        nodes: [...base, { id: "n", value: 7, next: "a" }],
        head: "n", ptrs: {}, line: 6, caption: "ini passa a apontar para o novo nó ✅"
    },
];