export type VizNode = {
    id: string;
    value: number;
    next: string | null;
    state?: "novo" | "visitando" | "removido";
};

export type Frame = {
    nodes: VizNode[];
    head: string | null;            // o ponteiro "ini"
    ptrs: Record<string, string | null>; // ex.: { aux: "b" }
    line?: number;                  // linha do código a destacar
    caption: string;                // explicação em texto
};