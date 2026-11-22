export type NodeState = "novo" | "visitando" | "removido" | "achado";

/* ───────── 🔗 Listas encadeadas ───────── */
export type VizNode = {
    id: string;
    value: number | string;
    next: string | null; // id do próximo nó (null = NULL)
    state?: NodeState;
};

export type Frame = {
    nodes: VizNode[];
    head: string | null;
    ptrs?: Record<string, string | null>;
    vars?: Record<string, string | number>;
    line?: number;
    caption: string;
};

// `Sim` continua sendo a simulação de LISTA (os 13 arquivos não mudam)
export type Sim = {
    kind?: "list";
    title: string;
    code: string;
    frames: Frame[];
    headLabel?: string; // texto da caixa inicial: "ini" (padrão), "topo"...
};

/* ───────── 🧮 Vetores (pilhas e filas) ───────── */
export type Cell = { value: number | string; state?: NodeState };

export type ArrayFrame = {
    cells: (Cell | null)[];        // null = posição vazia
    ptrs?: Record<string, number>; // marcadores: { topo: 2 }. Use -1 para "vazia"
    vars?: Record<string, string | number>;
    line?: number;
    caption: string;
};

export type ArraySimData = {
    kind: "array";
    title: string;
    code: string;
    capacity: number; // quantas posições o vetor tem
    orientation: "vertical" | "horizontal"; // pilha = vertical, fila = horizontal
    frames: ArrayFrame[];
};

// Qualquer simulação que o <Sim name="..." /> pode mostrar
export type AnySim = Sim | ArraySimData;