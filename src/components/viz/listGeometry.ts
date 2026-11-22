import type { Frame } from "../../viz-data/types";

// ───── medidas do desenho (em unidades do SVG) ─────
export const R = 24;           // raio do nó
export const GAP = 100;        // distância entre colunas
export const START_X = 130;    // x da coluna 0
export const MAIN_Y = 150;     // linha principal (a lista)
export const LOOSE_Y = 56;     // linha de cima (nós soltos)
export const H_NORMAL = 240;
export const H_CIRCULAR = 290; // listas com setas de volta precisam de espaço embaixo
export const BOX = { x: 14, w: 50, h: 28 }; // caixa `ini`
export const BOX_CX = BOX.x + BOX.w / 2;

export type Pt = { x: number; y: number };
export type EdgeKind = "next" | "prev";
export type Edge = { key: string; kind: EdgeKind; d: string };

/* ───────────────────────── 📍 Onde fica cada nó ───────────────────────── */

export function layout(f: Frame) {
  const pos = new Map<string, Pt>();
  const chain: string[] = [];
  const byId = new Map(f.nodes.map((n) => [n.id, n] as const));

  // 1) nós com posição fixa (col/row)
  for (const n of f.nodes) {
    if (n.col !== undefined) {
      pos.set(n.id, { x: START_X + n.col * GAP, y: n.row === "top" ? LOOSE_Y : MAIN_Y });
    }
  }

  // 2) a cadeia que sai de `ini` vai em fila na linha principal (a `seen` protege contra ciclos)
  const seen = new Set<string>();
  let cur = f.head;
  while (cur && !seen.has(cur)) {
    const node = byId.get(cur);
    if (!node) break;
    seen.add(cur);
    chain.push(cur);
    if (!pos.has(cur)) pos.set(cur, { x: START_X + (chain.length - 1) * GAP, y: MAIN_Y });
    cur = node.next;
  }

  // 3) o resto fica solto na linha de cima
  let slot = 0;
  for (const n of f.nodes) {
    if (pos.has(n.id)) continue;
    const target = n.next ? pos.get(n.next) : undefined;
    pos.set(n.id, { x: target ? target.x - GAP / 2 : START_X + slot++ * GAP, y: LOOSE_Y });
  }
  return { pos, chain };
}

/* ───────────────────────── ➡️ Setas ───────────────────────── */

const f1 = (v: number) => v.toFixed(1);

// Toda seta é "M x y Q cx cy x y": um formato único, para o motion conseguir animar a troca de forma
const quad = (sx: number, sy: number, cx: number, cy: number, ex: number, ey: number) =>
  `M${f1(sx)} ${f1(sy)} Q${f1(cx)} ${f1(cy)} ${f1(ex)} ${f1(ey)}`;

const straight = (sx: number, sy: number, ex: number, ey: number) =>
  quad(sx, sy, (sx + ex) / 2, (sy + ey) / 2, ex, ey);

export function edgePath(a: Pt, b: Pt, kind: EdgeKind, doubly: boolean): string {
  // 1) laço: o nó aponta para ele mesmo (prox → lado direito; prev → por cima)
  if (a.x === b.x && a.y === b.y) {
    return kind === "next"
      ? quad(a.x + 0.8 * R, a.y - 0.6 * R, a.x + R + 55, a.y, a.x + 0.8 * (R + 5), a.y + 0.6 * (R + 5))
      : quad(a.x - 0.6 * R, a.y - 0.8 * R, a.x, a.y - R - 60, a.x + 0.6 * (R + 5), a.y - 0.8 * (R + 5));
  }

  const dx = b.x - a.x, dy = b.y - a.y;

  // 2) mesma linha e longe: arco. Para a frente passa POR CIMA; de volta passa POR BAIXO
  if (Math.abs(dy) < 1 && Math.abs(dx) > GAP * 1.2) {
    const depth = Math.min(110, Math.max(64, 50 + Math.abs(dx) * 0.2));
    const s = kind === "next" ? 0.5 : 0; // `prev` sai do centro, para não colar na seta `prox`
    const c = Math.sqrt(1 - s * s);
    if (dx > 0) {
      const sx = a.x + s * R, sy = a.y - c * R;
      const ex = b.x - s * (R + 5), ey = b.y - c * (R + 5);
      return quad(sx, sy, (sx + ex) / 2, a.y - R - depth, ex, ey);
    }
    const sx = a.x - s * R, sy = a.y + c * R;
    const ex = b.x + s * (R + 5), ey = b.y + c * (R + 5);
    const below = Math.min(125, Math.max(105, 85 + Math.abs(dx) * 0.2)); // mais fundo: deixa os rótulos passarem
    return quad(sx, sy, (sx + ex) / 2, a.y + R + below, ex, ey);
  }

  // 3) reta de borda a borda. Em lista dupla, `prox` sobe 6px e `prev` desce 6px
  const d = Math.hypot(dx, dy) || 1;
  const ux = dx / d, uy = dy / d;
  const off = doubly ? (kind === "next" ? -6 : 6) : 0;
  const nx = ux >= 0 ? -uy : uy; // normal que sempre aponta "para baixo"
  const ny = ux >= 0 ? ux : -ux;
  const px = nx * off, py = ny * off;
  return straight(a.x + ux * R + px, a.y + uy * R + py, b.x - ux * (R + 5) + px, b.y - uy * (R + 5) + py);
}

export function buildEdges(f: Frame, pos: Map<string, Pt>, doubly: boolean): Edge[] {
  const out: Edge[] = [];
  for (const n of f.nodes) {
    const a = pos.get(n.id);
    if (!a) continue;
    if (n.next) {
      const b = pos.get(n.next);
      if (b) out.push({ key: `${n.id}-next`, kind: "next", d: edgePath(a, b, "next", doubly) });
    }
    if (n.prev) {
      const b = pos.get(n.prev);
      if (b) out.push({ key: `${n.id}-prev`, kind: "prev", d: edgePath(a, b, "prev", doubly) });
    }
  }
  return out;
}

/** Seta da caixa `ini` até o primeiro nó. `null` = ini aponta para NULL. */
export function headPath(hp: Pt | undefined): string | null {
  if (!hp) return null;
  const startX = BOX.x + BOX.w + 2;
  if (hp.y === MAIN_Y && hp.x <= START_X + 1) return straight(startX, MAIN_Y, hp.x - R - 5, MAIN_Y);
  if (hp.y === MAIN_Y) {
    // o primeiro nó está mais à direita: a seta passa por cima
    return quad(BOX_CX, MAIN_Y - BOX.h / 2, (BOX_CX + hp.x) / 2, MAIN_Y - 105, hp.x, hp.y - R - 5);
  }
  const dx = hp.x - startX, dy = hp.y - MAIN_Y;
  const d = Math.hypot(dx, dy) || 1;
  return straight(startX, MAIN_Y, hp.x - (dx / d) * (R + 5), hp.y - (dy / d) * (R + 5));
}

/** Onde desenhar o "NULL" de um nó: à direita; se houver vizinho ali, em cima; se também houver nó em cima, embaixo. */
export function stubSide(id: string, pos: Map<string, Pt>): "right" | "up" | "down" {
  const p = pos.get(id);
  if (!p) return "right";
  let rightBlocked = false;
  let upBlocked = false;
  for (const [other, q] of pos) {
    if (other === id) continue;
    if (Math.abs(q.y - p.y) < 1 && q.x > p.x && q.x - p.x < 2 * R + 70) rightBlocked = true;
    if (Math.abs(q.x - p.x) < 2 * R && q.y < p.y && p.y - q.y < 2 * R + 70) upBlocked = true;
  }
  if (!rightBlocked) return "right";
  return upBlocked ? "down" : "up";
}

/* ───────────────────────── 🏷️ Rótulos dos ponteiros ───────────────────────── */

export function ptrLabels(f: Frame, pos: Map<string, Pt>, chain: string[]) {
  const stack = new Map<string, number>();
  return Object.entries(f.ptrs ?? {}).flatMap(([name, target]) => {
    let base: Pt, key: string;
    if (target === null) {
      const last = chain.length ? pos.get(chain[chain.length - 1])! : { x: START_X - 70, y: MAIN_Y };
      base = { x: last.x + 70, y: MAIN_Y };
      key = "NULL";
    } else {
      const p = pos.get(target);
      if (!p) return [];
      base = p;
      key = target;
    }
    const k = stack.get(key) ?? 0;
    stack.set(key, k + 1);
    const above = base.y < MAIN_Y;
    const nullBelow = target !== null && f.nodes.find((n) => n.id === target)?.next === null && stubSide(target, pos) === "down";
    return [{
      name, above,
      x: base.x,
      y: above ? base.y - R - 14 - k * 20 : base.y + R + 20 + (nullBelow ? 30 : 0) + k * 20,
    }];
  });
}
