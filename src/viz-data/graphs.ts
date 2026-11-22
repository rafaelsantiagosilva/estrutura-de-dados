/* ───────── tipos ───────── */

/** Cor funcional (vira var(--color-...) em components/viz/colors.ts). */
export type GraphTone = "brand" | "ok" | "warn" | "danger" | "muted";

export type GraphNode = {
    id: number;
    x: number;
    y: number;
    label?: string; // texto dentro do nó (padrão = id). Útil quando dois grafos aparecem na mesma figura
    tone?: GraphTone;
};

export type GraphEdge = {
    from: number;
    to: number;
    weight?: number;
    curve?: number; // > 0 curva para a "esquerda" de from→to (use ± para arestas paralelas)
    loop?: "up" | "down" | "left" | "right"; // só para laços (from === to)
    wside?: 1 | -1; // lado do rótulo do peso
    tone?: GraphTone;
    arrow?: boolean; // seta mesmo em grafo não direcionado (para mostrar o sentido de um caminho)
    delay?: number; // segundos até começar a desenhar (para animar um caminho em sequência)
};

/** Moldura tracejada em volta de um conjunto de nós (componentes, painéis...). */
export type GraphGroup = {
    label: string;
    ids: number[];
    tone: GraphTone;
    paint?: boolean; // false = só a moldura, sem colorir nós/arestas
};

export type GraphData = {
    title: string;
    width: number;
    height: number;
    caption: string; // legenda padrão (quando nenhum nó está selecionado)
    directed?: boolean;
    info?: boolean; // false = hover só destaca, sem texto de grau/vizinhos
    degrees?: boolean; // mostra o grau de cada nó em uma bolinha
    nodes: GraphNode[];
    edges: GraphEdge[];
    groups?: GraphGroup[];
    legend?: { tone: GraphTone; text: string }[];
    vars?: Record<string, string | number>;
};

/* ───────── atalhos ───────── */

const N = (id: number, x: number, y: number, extra: Partial<GraphNode> = {}): GraphNode => ({ id, x, y, ...extra });
const E = (from: number, to: number, extra: Partial<GraphEdge> = {}): GraphEdge => ({ from, to, ...extra });

/* ───────── registro: use no MDX com <Grafo name="..." /> ───────── */

export const graphs: Record<string, GraphData> = {
    /* Caminhos simples e cíclicos */
    caminhos: {
        title: "caminhos",
        width: 640,
        height: 310,
        caption: "Siga as setas: o caminho verde nunca repete um nó; o amarelo volta para o nó `1`, então é cíclico.",
        nodes: [
            N(1, 90, 60),
            N(2, 330, 60, { tone: "ok" }),
            N(5, 550, 150, { tone: "ok" }),
            N(3, 90, 250, { tone: "warn" }),
            N(4, 330, 250, { tone: "warn" }),
        ],
        edges: [
            E(2, 4),
            E(4, 5),
            E(1, 2, { tone: "ok", arrow: true, delay: 0.8 }),
            E(2, 5, { tone: "ok", arrow: true, delay: 1.3 }),
            E(1, 3, { tone: "warn", arrow: true, delay: 2.0 }),
            E(3, 4, { tone: "warn", arrow: true, delay: 2.5 }),
            E(4, 1, { tone: "warn", arrow: true, delay: 3.0 }),
        ],
        legend: [
            { tone: "ok", text: "caminho simples: 1 → 2 → 5" },
            { tone: "warn", text: "caminho cíclico (não simples): 1 → 3 → 4 → 1" },
        ],
    },

    /* Conexo x não conexo */
    conexo: {
        title: "conexo × não conexo",
        width: 700,
        height: 300,
        caption: "Passe o mouse nos nós: no grafo da direita, o nó `4` não tem nenhum vizinho, então não existe caminho até ele.",
        nodes: [
            N(1, 70, 70), N(2, 260, 70), N(3, 70, 230), N(4, 260, 230),
            N(5, 440, 70, { label: "1" }), N(6, 630, 70, { label: "2" }),
            N(7, 440, 230, { label: "3" }), N(8, 630, 230, { label: "4", tone: "danger" }),
        ],
        edges: [
            E(1, 2), E(1, 3), E(1, 4), E(2, 4), E(3, 4),
            E(5, 6), E(5, 7), E(6, 7),
        ],
        groups: [
            { label: "Conexo", ids: [1, 2, 3, 4], tone: "ok", paint: false },
            { label: "Não conexo", ids: [5, 6, 7, 8], tone: "danger", paint: false },
        ],
    },

    /* Componentes */
    componentes: {
        title: "componentes",
        width: 620,
        height: 380,
        caption: "Este grafo não é conexo: tem 3 componentes. Um nó sozinho, como o `8`, também conta como componente.",
        nodes: [
            N(1, 80, 60), N(2, 260, 60), N(3, 80, 200),
            N(4, 370, 170), N(5, 540, 170), N(6, 370, 320), N(7, 540, 320),
            N(8, 540, 50),
        ],
        edges: [
            E(1, 2), E(1, 3), E(2, 3),
            E(4, 5), E(4, 6), E(4, 7), E(5, 7), E(6, 7),
        ],
        groups: [
            { label: "C1", ids: [1, 2, 3], tone: "brand" },
            { label: "C2", ids: [4, 5, 6, 7], tone: "ok" },
            { label: "C3", ids: [8], tone: "warn" },
        ],
        legend: [
            { tone: "brand", text: "C1 = {1, 2, 3}" },
            { tone: "ok", text: "C2 = {4, 5, 6, 7}" },
            { tone: "warn", text: "C3 = {8}" },
        ],
        vars: { componentes: 3 },
    },

    /* Árvore */
    arvore: {
        title: "árvore",
        width: 620,
        height: 300,
        caption: "Uma árvore: `n = 5` nós e `n - 1 = 4` arestas, sem ciclos. 🌳",
        nodes: [N(1, 110, 70), N(2, 330, 70), N(3, 110, 230), N(4, 330, 230), N(5, 530, 150)],
        edges: [E(1, 2), E(1, 3), E(2, 4), E(2, 5)],
        vars: { n: 5, m: 4 },
    },

    /* Direcionado */
    direcionado: {
        title: "grafo direcionado",
        width: 620,
        height: 330,
        caption: "Passe o mouse em um nó para ver o grau de entrada e o grau de saída.",
        directed: true,
        nodes: [N(1, 80, 60), N(2, 330, 60), N(5, 540, 130), N(3, 80, 270), N(4, 330, 270)],
        edges: [E(1, 2), E(2, 5), E(2, 4), E(4, 1), E(3, 1)],
    },

    /* Ponderado */
    ponderado: {
        title: "grafo ponderado",
        width: 620,
        height: 320,
        caption: "O número sobre cada aresta é o seu peso (custo) para ser percorrida.",
        nodes: [N(1, 80, 60), N(2, 330, 60), N(5, 540, 140), N(3, 80, 260), N(4, 330, 260)],
        edges: [
            E(1, 2, { weight: 5 }),
            E(1, 3, { weight: 1 }),
            E(2, 4, { weight: 6 }),
            E(2, 5, { weight: 7 }),
            E(3, 4, { weight: 7 }),
            E(4, 5, { weight: 3 }),
        ],
    },

    /* Vizinhos e graus */
    graus: {
        title: "vizinhos e graus",
        width: 640,
        height: 320,
        caption: "A bolinha amarela é o grau do nó. Passe o mouse para ver quem são os vizinhos.",
        degrees: true,
        nodes: [N(1, 120, 60), N(2, 360, 60), N(5, 570, 140), N(3, 120, 260), N(4, 360, 260)],
        edges: [E(1, 2), E(1, 3), E(1, 4), E(2, 4), E(2, 5), E(3, 4)],
    },

    /* Coloração / bipartido */
    coloracao: {
        title: "coloração (grafo bipartido)",
        width: 620,
        height: 320,
        caption: "Nenhuma aresta liga dois nós da mesma cor, então o grafo é bipartido. 🎨",
        nodes: [
            N(1, 80, 60, { tone: "brand" }),
            N(2, 310, 60, { tone: "brand" }),
            N(3, 540, 60, { tone: "warn" }),
            N(4, 80, 260, { tone: "warn" }),
            N(5, 310, 260, { tone: "warn" }),
            N(6, 540, 260, { tone: "brand" }),
        ],
        edges: [E(1, 4), E(1, 5), E(2, 3), E(2, 5), E(3, 6), E(5, 6)],
        legend: [
            { tone: "brand", text: "cor A" },
            { tone: "warn", text: "cor B" },
        ],
    },

    /* Não simples */
    "nao-simples": {
        title: "grafo não simples",
        width: 620,
        height: 330,
        caption: "Repare no laço do nó `4` e nas duas arestas entre `2` e `3`.",
        info: false,
        nodes: [N(1, 110, 70), N(2, 330, 70), N(3, 540, 70), N(4, 110, 260), N(5, 330, 260), N(6, 540, 260)],
        edges: [
            E(1, 4), E(1, 5), E(2, 5), E(3, 6), E(5, 6),
            E(2, 3, { curve: 28, tone: "danger" }),
            E(2, 3, { curve: -28, tone: "danger" }),
            E(4, 4, { loop: "left", tone: "danger" }),
        ],
        legend: [{ tone: "danger", text: "laço e arestas paralelas" }],
    },

    /* Exemplos da página de representações */
    exemplo: {
        title: "exemplo sem pesos",
        width: 560,
        height: 320,
        caption: "Grafo dos exemplos de código: `1 → 2`, `2 → 3`, `2 → 4`, `4 → 3` e `4 → 1`.",
        directed: true,
        nodes: [N(1, 80, 70), N(2, 280, 70), N(3, 480, 70), N(4, 280, 250)],
        edges: [E(1, 2), E(2, 3), E(2, 4), E(4, 3), E(4, 1)],
    },

    "exemplo-ponderado": {
        title: "exemplo com pesos",
        width: 560,
        height: 320,
        caption: "O mesmo grafo, agora com um peso em cada aresta.",
        directed: true,
        nodes: [N(1, 80, 70), N(2, 280, 70), N(3, 480, 70), N(4, 280, 250)],
        edges: [
            E(1, 2, { weight: 5 }),
            E(2, 3, { weight: 7 }),
            E(2, 4, { weight: 6 }),
            E(4, 3, { weight: 5 }),
            E(4, 1, { weight: 2 }),
        ],
    },
};