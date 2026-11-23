import type { TreeFrame } from "../../viz-data/arvores/treeTypes";

// ───── medidas do desenho (em unidades do SVG) ─────
export const HALF = 20; // metade do lado do nó (quadrado)
export const DX = 54; // distância horizontal entre nós consecutivos (em-ordem)
export const DY = 66; // distância vertical entre níveis
export const PAD_X = 36;
export const PAD_TOP = 54; // espaço para os rótulos dos ponteiros

export type Pt = { x: number; y: number };

/**
 * Onde fica cada nó.
 * - x: posição do nó no percurso EM-ORDEM (nós vizinhos ficam lado a lado, sem se sobrepor);
 * - y: profundidade do nó;
 * - nós que NÃO estão ligados à raiz (soltos) ficam empilhados em uma coluna à direita (`stageX`).
 */
export function layout(f: TreeFrame, stageX: number) {
    const pos = new Map<string, Pt>();
    const byId = new Map(f.nodes.map((n) => [n.id, n] as const));
    const seen = new Set<string>(); // protege contra ciclos
    let idx = 0;
    let maxDepth = 0;

    const walk = (id: string | null, depth: number) => {
        if (!id || seen.has(id)) return;
        const n = byId.get(id);
        if (!n) return;
        seen.add(id);
        walk(n.esq, depth + 1);
        pos.set(id, { x: PAD_X + idx * DX, y: PAD_TOP + depth * DY });
        idx++;
        maxDepth = Math.max(maxDepth, depth);
        walk(n.dir, depth + 1);
    };
    walk(f.root, 0);

    let loose = 0;
    for (const n of f.nodes) {
        if (pos.has(n.id)) continue;
        pos.set(n.id, { x: stageX, y: PAD_TOP + loose * DY });
        loose++;
    }
    return { pos, count: idx, maxDepth, loose };
}

/** Tamanho do desenho: cabe a maior árvore de TODOS os frames (assim o desenho não "pula"). */
export function treeDims(frames: TreeFrame[]) {
    let cols = 1;
    let depth = 0;
    let loose = 0;
    for (const f of frames) {
        const l = layout(f, 0);
        cols = Math.max(cols, l.count);
        depth = Math.max(depth, l.maxDepth);
        loose = Math.max(loose, l.loose);
    }
    const treeW = PAD_X * 2 + (cols - 1) * DX;
    const W = Math.max(420, treeW + (loose ? 80 : 0));
    const H = PAD_TOP + depth * DY + 90; // sobra espaço embaixo para os quadradinhos NULL
    const stageX = W - 40;
    return { W, H, stageX };
}

export type TreeDims = ReturnType<typeof treeDims>;