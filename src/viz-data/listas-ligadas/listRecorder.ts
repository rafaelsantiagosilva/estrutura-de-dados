import type { Frame, NodeState, VizNode } from "../types";

export type Marks = Record<string, NodeState>;
type Ptrs = Record<string, string | null>;
type Vars = Record<string, string | number>;

const LETTERS = "abcdefghijklmnopqrstuvwxyz";

type Options = {
  fixed?: boolean;    // cada nó ganha uma coluna fixa (col = posição inicial)
  circular?: boolean; // o último nó aponta para o primeiro
  doubly?: boolean;   // cria também os `prev`
};

/**
 * Grava frames de LISTA enquanto o gerador altera a lista de verdade
 * (igual ao `createRecorder` dos vetores). Os nós iniciais ganham ids a, b, c...
 *
 *   const r = createListRecorder([3, 4, 9]);
 *   r.get("a").next = "c";          // altera a lista
 *   r.add(7, "legenda", { aux: "a" }, { k: 3 }, { a: "visitando" }); // tira a "fotografia"
 */
export function createListRecorder(values: number[], opts: Options = {}) {
  const nodes = new Map<string, VizNode>();
  const frames: Frame[] = [];
  const n = values.length;

  values.forEach((value, i) => {
    nodes.set(LETTERS[i], {
      id: LETTERS[i],
      value,
      next: i < n - 1 ? LETTERS[i + 1] : opts.circular ? LETTERS[0] : null,
      ...(opts.doubly ? { prev: i > 0 ? LETTERS[i - 1] : opts.circular ? LETTERS[n - 1] : null } : {}),
      ...(opts.fixed ? { col: i } : {}),
    });
  });

  const s = { head: (n ? "a" : null) as string | null }; // para onde `ini` aponta

  const get = (id: string): VizNode => {
    const node = nodes.get(id);
    if (!node) throw new Error(`nó "${id}" não existe`);
    return node;
  };

  /** ids na ordem em que aparecem seguindo `prox` (com proteção contra ciclos) */
  const chainOf = (from: string | null): string[] => {
    const out: string[] = [];
    let cur = from;
    while (cur && !out.includes(cur)) {
      out.push(cur);
      cur = get(cur).next;
    }
    return out;
  };

  return {
    frames,
    s,
    get,
    chainOf,

    /** cria um nó novo (solto, com prox = NULL, como o `newNo`) */
    addNode(id: string, value: number | string, state?: VizNode["state"]) {
      nodes.set(id, { id, value, next: null, ...(state ? { state } : {}) });
    },

    /** `free(no)`: o nó some da memória */
    removeNode(id: string) {
      nodes.delete(id);
    },

    /** coloca os nós `ids` em colunas 0, 1, 2... da linha `row` */
    place(ids: string[], row: "main" | "top" = "main") {
      ids.forEach((id, i) => {
        const node = get(id);
        node.col = i;
        node.row = row;
      });
    },

    /** (modo fixo) fecha os buracos: quem está na lista, a partir de `ini`, volta a ocupar as colunas 0, 1, 2... */
    compact() {
      this.place(chainOf(s.head), "main");
    },

    /** volta ao layout automático (em fila, na ordem da lista) */
    unfix() {
      nodes.forEach((node) => {
        delete node.col;
        delete node.row;
      });
    },

    /** "NULL" ou "nó 7": útil para os chips de variáveis */
    label(id: string | null) {
      return id === null ? "NULL" : `nó ${get(id).value}`;
    },

    /** tira uma fotografia da lista agora */
    add(line: number, caption: string, ptrs: Ptrs = {}, vars: Vars = {}, marks: Marks = {}) {
      frames.push({
        nodes: [...nodes.values()].map((node) => ({ ...node, state: marks[node.id] ?? node.state })),
        head: s.head,
        ptrs: { ...ptrs },
        vars: { ...vars },
        line,
        caption,
      });
    },
  };
}
