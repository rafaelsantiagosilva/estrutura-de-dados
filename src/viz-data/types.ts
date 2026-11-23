export type NodeState = "novo" | "visitando" | "removido" | "achado" | "descartado";

/* ───────── 🔗 Listas encadeadas ───────── */
export type VizNode = {
    id: string;
    value: number | string;
    next: string | null;        // id do próximo nó (null = NULL)
    prev?: string | null;       // lista duplamente ligada: id do nó anterior
    state?: NodeState;
    // Posição FIXA (opcional). Sem isso, o desenho decide sozinho:
    // quem é alcançável a partir de `ini` vai em fila e o resto fica na linha de cima.
    col?: number;               // coluna (0, 1, 2...)
    row?: "main" | "top";       // linha principal (padrão) ou linha de cima
};

export type Frame = {
    nodes: VizNode[];
    head: string | null;
    ptrs?: Record<string, string | null>;
    vars?: Record<string, string | number>;
    line?: number;
    caption: string;
};

// `Sim` continua sendo a simulação de LISTA
export type Sim = {
    kind?: "list";
    title: string;
    code: string;
    frames: Frame[];
    headLabel?: string; // texto da caixa inicial: "ini" (padrão), "topo"...
    circular?: boolean; // há setas de volta (lista circular): o desenho ganha mais altura
    doubly?: boolean;   // desenha `prox` (sólida) e `prev` (tracejada) lado a lado
};

/* ───────── 🧮 Vetores (pilhas, filas, ordenação) ───────── */
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
    capacity: number;
    orientation: "vertical" | "horizontal";
    frames: ArrayFrame[];
};

/* ───────── 🧮🧮 Vários vetores ao mesmo tempo (intercalação, partição) ───────── */
export type Row = {
    label: string;                  // nome do vetor: "v1", "v2", "v", "pivo"
    cells: (Cell | null)[];         // null = posição vazia
    ptrs?: Record<string, number>;  // marcadores desta linha: { top1: 0 }
};

export type RowsFrame = {
    rows: Row[];
    vars?: Record<string, string | number>;
    line?: number;
    caption: string;
};

export type RowsSimData = {
    kind: "rows";
    title: string;
    code: string;
    frames: RowsFrame[];
};

/* ───────── 🌳 Árvore de chamadas recursivas (MergeSort, QuickSort) ───────── */
export type TreeNode = {
    id: string;
    lo: number;                         // este nó cobre as posições lo..hi do vetor ORIGINAL
    hi: number;
    depth: number;                      // 0 = chamada inicial
    parent?: string;                    // id do nó pai (desenha a linha entre os dois)
    values: number[];                   // conteúdo atual (hi - lo + 1 valores)
    state?: NodeState;                  // cor da borda do nó inteiro
    cellStates?: Record<number, NodeState>; // cor de células específicas (índice ABSOLUTO)
};

export type TreeFrame = {
    nodes: TreeNode[];
    vars?: Record<string, string | number>;
    line?: number;
    caption: string;
};

export type TreeSimData = {
    kind: "tree";
    title: string;
    code: string;
    n: number;                          // tamanho do vetor original (define a largura)
    frames: TreeFrame[];
};


// Qualquer simulação que o <Sim name="..." /> pode mostrar
export type AnySim = Sim | ArraySimData | RowsSimData | TreeSimData;
