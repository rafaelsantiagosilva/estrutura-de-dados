import type { GraphData, GraphEdge } from "../../viz-data/graphs";

export const R = 24; // raio dos nós (igual ao ListSim)

type Pt = { x: number; y: number };

export type EdgeGeo = {
    d: string; // caminho da linha
    head?: string; // triângulo da seta
    label: Pt; // posição do peso
};

const f = (n: number) => n.toFixed(1);

const unit = (a: Pt, b: Pt): Pt => {
    const dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1;
    return { x: dx / l, y: dy / l };
};

/** Triângulo com a ponta em `tip`, apontando na direção `u`. */
function arrowHead(tip: Pt, u: Pt): string {
    const L = 11, W = 5.5;
    const n = { x: -u.y, y: u.x };
    const bx = tip.x - u.x * L, by = tip.y - u.y * L;
    return `M${f(tip.x)} ${f(tip.y)} L${f(bx + n.x * W)} ${f(by + n.y * W)} L${f(bx - n.x * W)} ${f(by - n.y * W)} Z`;
}

const LOOP_ANGLE = { right: 0, down: Math.PI / 2, left: Math.PI, up: -Math.PI / 2 };

/** Laço: aresta de um nó para ele mesmo. */
function loopGeometry(e: GraphEdge, a: Pt, arrow: boolean): EdgeGeo {
    const ang = LOOP_ANGLE[e.loop ?? "up"];
    const pt = (r: number, th: number): Pt => ({ x: a.x + r * Math.cos(th), y: a.y + r * Math.sin(th) });
    const s = pt(R, ang - 0.5);
    const tip = pt(R + (arrow ? 3 : 0), ang + 0.5);
    const c1 = pt(R + 60, ang - 0.85);
    const c2 = pt(R + 60, ang + 0.85);
    return {
        d: `M${f(s.x)} ${f(s.y)} C${f(c1.x)} ${f(c1.y)} ${f(c2.x)} ${f(c2.y)} ${f(tip.x)} ${f(tip.y)}`,
        head: arrow ? arrowHead(tip, unit(c2, tip)) : undefined,
        label: pt(R + 40, ang),
    };
}

/** Linha (reta ou curva) entre as bordas de dois nós. */
export function edgeGeometry(e: GraphEdge, a: Pt, b: Pt, arrow: boolean): EdgeGeo {
    if (e.from === e.to) return loopGeometry(e, a, arrow);

    const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    const u = unit(a, b);
    const n = { x: u.y, y: -u.x }; // "esquerda" de quem vai de a para b
    const c = e.curve ?? 0;
    const ctrl = { x: mid.x + n.x * c * 2, y: mid.y + n.y * c * 2 };

    const u1 = c ? unit(a, ctrl) : u;
    const u2 = c ? unit(ctrl, b) : u;
    const start = { x: a.x + u1.x * R, y: a.y + u1.y * R };
    const gap = arrow ? R + 3 : R;
    const tip = { x: b.x - u2.x * gap, y: b.y - u2.y * gap };
    const end = arrow ? { x: tip.x - u2.x * 8, y: tip.y - u2.y * 8 } : tip; // a linha para antes da seta

    const bx = 0.25 * start.x + 0.5 * ctrl.x + 0.25 * end.x;
    const by = 0.25 * start.y + 0.5 * ctrl.y + 0.25 * end.y;
    const off = c ? Math.sign(c) * 14 : (e.wside ?? 1) * 16;

    return {
        d: `M${f(start.x)} ${f(start.y)} Q${f(ctrl.x)} ${f(ctrl.y)} ${f(end.x)} ${f(end.y)}`,
        head: arrow ? arrowHead(tip, u2) : undefined,
        label: { x: bx + n.x * off, y: by + n.y * off },
    };
}

/** Retângulo que envolve um conjunto de nós. */
export function groupBox(points: Pt[], pad = 46) {
    const xs = points.map((p) => p.x), ys = points.map((p) => p.y);
    const x = Math.min(...xs) - pad, y = Math.min(...ys) - pad;
    return { x, y, width: Math.max(...xs) + pad - x, height: Math.max(...ys) + pad - y };
}

/* ───────── graus e vizinhos ───────── */

const uniq = (ids: number[]) => [...new Set(ids)].sort((a, b) => a - b);

const outOf = (g: GraphData, id: number) => uniq(g.edges.filter((e) => e.from === id && e.to !== id).map((e) => e.to));
const inOf = (g: GraphData, id: number) => uniq(g.edges.filter((e) => e.to === id && e.from !== id).map((e) => e.from));
const neighborsOf = (g: GraphData, id: number) => uniq([...outOf(g, id), ...inOf(g, id)]);

export const degreeOf = (g: GraphData, id: number) => neighborsOf(g, id).length;

/** Texto (com `crases`) mostrado quando o mouse está sobre um nó. */
export function describe(g: GraphData, id: number): string {
    const lab = (i: number) => "`" + (g.nodes.find((n) => n.id === i)?.label ?? i) + "`";
    const list = (ids: number[]) => ids.map(lab).join(", ");
    const par = (ids: number[], txt: string) => (ids.length ? ` (${txt} ${list(ids)})` : "");

    if (g.directed) {
        const inn = inOf(g, id), out = outOf(g, id);
        return `Nó ${lab(id)}: grau de entrada ${inn.length}${par(inn, "vem de")} · grau de saída ${out.length}${par(out, "vai para")}.`;
    }

    const viz = neighborsOf(g, id);
    return `Nó ${lab(id)}: grau ${viz.length}${viz.length ? ` · vizinhos: ${list(viz)}` : ""}.`;
}