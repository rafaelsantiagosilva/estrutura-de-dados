export type NodeState = "novo" | "visitando" | "removido" | "achado";

export type VizNode = {
    id: string;
    value: number | string; // ← era só `number`
    next: string | null;
    state?: NodeState;
};

export type Frame = {
    nodes: VizNode[];
    head: string | null;                   // para onde `ini` aponta
    ptrs?: Record<string, string | null>;  // rótulos: { aux: "b", no: "n" }
    vars?: Record<string, string | number>; // variáveis mostradas em "chips"
    line?: number;                         // linha do código (1 = primeira)
    caption: string;                       // explicação (`crases` viram código)
};

export type Cell = { value: number | string; state?: NodeState };

export type ArrayFrame = {
    cells: (Cell | null)[];          // null = posição vazia
    ptrs?: Record<string, number>;   // índice para onde cada marcador aponta: { topo: 2 } (-1 = vazia)
    vars?: Record<string, string | number>;
    line?: number;
    caption: string;
};

export type ListSimData = { kind?: "list"; title: string; code: string; frames: Frame[] };
export type ArraySimData = {
    kind: "array"; title: string; code: string; frames: ArrayFrame[];
    capacity: number; orientation: "vertical" | "horizontal"
};

export type Sim = ListSimData | ArraySimData;