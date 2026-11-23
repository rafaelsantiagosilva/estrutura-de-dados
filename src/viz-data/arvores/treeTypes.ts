import type { NodeState } from "../types";

/**
 * Tipos das simulações de ÁRVORE BINÁRIA.
 *
 * `kind: "tree"`    → TreeSim     (desenha a árvore, igual aos outros Sim)
 * `kind: "treexml"` → TreeXmlSim  (árvore + arquivo XML sendo escrito ao lado)
 *
 * ⚠️ Para registrar no `viz-data/index.ts`, acrescente os dois tipos na união `AnySim` (em types.ts):
 *   import type { TreeSimData, TreeXmlSimData } from "./treeTypes";
 *   export type AnySim = Sim | ArraySimData | TreeSimData | TreeXmlSimData;
 */

/** Um nó. `esq` e `dir` são ids de outros nós (ou null = ponteiro NULL). */
export type TreeNode = {
    id: string;
    value: number;
    esq: string | null;
    dir: string | null;
    state?: NodeState;
};

/** Um ponteiro NULL que queremos destacar (aparece como um quadradinho tracejado). */
export type TreeHole = { parent: string; side: "esq" | "dir" };

export type TreeFrame = {
    line?: number; // linha dentro de `code` (começa em 1)
    caption: string; // aceita `crases`
    vars?: Record<string, string | number>;
    root: string | null; // id do nó raiz (null = árvore vazia)
    nodes: TreeNode[]; // nós que existem neste frame; os que não estão ligados à raiz ficam "soltos"
    ptrs?: Record<string, string | null>; // rótulos acima dos nós (aux, no, raiz...)
    holes?: TreeHole[];
};

export type TreeSimData = {
    kind: "tree";
    title: string;
    code: string;
    frames: TreeFrame[];
};

/** Uma linha do arquivo XML. `depth` só serve para indentar na tela. */
export type XmlLine = { text: string; depth: number; kind: "tag" | "value" };

export type TreeXmlFrame = TreeFrame & { xml: XmlLine[] };

export type TreeXmlSimData = {
    kind: "treexml";
    title: string;
    code: string;
    frames: TreeXmlFrame[];
};