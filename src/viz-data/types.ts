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

export type Sim = {
    title: string;
    code: string;
    frames: Frame[];
};