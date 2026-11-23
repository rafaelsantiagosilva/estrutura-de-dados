import type { Cell, NodeState, Row, RowsFrame, RowsSimData, TreeFrame, TreeNode, TreeSimData } from "./types";

type Marks = Record<number, NodeState>;
type Slot = number | null;

const cells = (v: Slot[], marks: Marks = {}): (Cell | null)[] =>
  v.map((value, k) => (value === null ? null : { value, state: marks[k] }));

/* ═══════════════════ 🔀 MergeSort: a intercalação (merge) ═══════════════════ */

export const V1 = [1, 2, 5, 9];
export const V2 = [2, 3, 4, 7]; // os vetores da Figura 9.5 da apostila

const CODE_MERGE = String.raw`void merge(int *v1, int n1, int *v2, int n2, int *v)
{
    int top1 = 0, top2 = 0, top = 0;
    while (top1 < n1 && top2 < n2)
    {
        if (v1[top1] < v2[top2])
        {
            v[top++] = v1[top1++];
        }
        else
        {
            v[top++] = v2[top2++];
        }
    }
    // copia o que sobrou do v1 (se sobrou)
    while (top1 < n1)
    {
        v[top++] = v1[top1++];
    }
    // copia o que sobrou do v2 (se sobrou)
    while (top2 < n2)
    {
        v[top++] = v2[top2++];
    }
}`;

function buildMerge() {
  const n1 = V1.length, n2 = V2.length;
  const v: Slot[] = Array(n1 + n2).fill(null);
  const used1 = new Set<number>(), used2 = new Set<number>(); // já consumidos: ficam apagados
  let top1 = 0, top2 = 0, top = 0;
  const frames: RowsFrame[] = [];

  const mk = (used: Set<number>, extra: Marks = {}): Marks => {
    const m: Marks = {};
    used.forEach((k) => (m[k] = "descartado"));
    return { ...m, ...extra };
  };

  // `m1`, `m2`, `mv`: marcas extras de cada linha; `show`: quais marcadores aparecem
  const snap = (line: number, caption: string, o: { m1?: Marks; m2?: Marks; mv?: Marks; ptrs?: boolean } = {}) => {
    const rows: Row[] = [
      { label: "v1", cells: cells(V1, mk(used1, o.m1)), ptrs: o.ptrs ? { top1 } : {} },
      { label: "v2", cells: cells(V2, mk(used2, o.m2)), ptrs: o.ptrs ? { top2 } : {} },
      { label: "v", cells: cells(v, o.mv), ptrs: o.ptrs ? { top } : {} },
    ];
    frames.push({ rows, vars: o.ptrs ? { top1, top2, top } : { n1, n2 }, line, caption });
  };

  snap(1, "`merge(v1, 4, v2, 4, v)`: **intercalar** dois vetores que **já estão ordenados** em um vetor `v` também ordenado. O `v` começa vazio (posições tracejadas).");
  snap(3, "Três contadores (os \"dedinhos\" da apostila): `top1` aponta o próximo elemento do `v1`, `top2` o do `v2` e `top` a próxima posição livre do `v`. Todos começam em 0.", { ptrs: true });

  let primeira = true;
  while (top1 < n1 && top2 < n2) {
    if (primeira) {
      snap(4, "`top1 < n1 && top2 < n2`? Sim: ainda há elementos **nos dois** vetores. Entramos no laço.", { ptrs: true });
      primeira = false;
    }
    const a = V1[top1], b = V2[top2];
    const doV1 = a < b;
    snap(6, `\`v1[top1] < v2[top2]\`? \`${a} < ${b}\`? ${doV1 ? "**Sim**: o menor é o do `v1`." : `Não: o menor é o do \`v2\`${a === b ? " (em caso de empate, a condição `<` manda pegar o do `v2`)" : ""}.`}`,
      { ptrs: true, m1: { [top1]: "visitando" }, m2: { [top2]: "visitando" } });

    if (doV1) {
      v[top] = a; used1.add(top1);
      const at = top;
      top1++; top++;
      snap(8, `\`v[top++] = v1[top1++]\`: o ${a} vai para \`v[${at}]\` e os contadores \`top1\` e \`top\` avançam. O elemento do \`v1\` foi **consumido**.`, { ptrs: true, mv: { [at]: "novo" } });
    } else {
      v[top] = b; used2.add(top2);
      const at = top;
      top2++; top++;
      snap(12, `\`v[top++] = v2[top2++]\`: o ${b} vai para \`v[${at}]\` e os contadores \`top2\` e \`top\` avançam. O elemento do \`v2\` foi **consumido**.`, { ptrs: true, mv: { [at]: "novo" } });
    }
  }

  snap(4, `\`top1 < n1 && top2 < n2\`? \`top2 < n2\` é \`${top2} < ${n2}\`: **falso**. O \`v2\` acabou, e o laço termina. Mas o \`v1\` ainda tem elemento!`, { ptrs: true });

  snap(16, `\`top1 < n1\`? \`${top1} < ${n1}\`? Sim: sobrou elemento no \`v1\`. Como ele já é maior que tudo que foi copiado e o \`v1\` está ordenado, basta **copiar o resto**.`, { ptrs: true, m1: { [top1]: "visitando" } });
  while (top1 < n1) {
    const x = V1[top1];
    v[top] = x; used1.add(top1);
    const at = top;
    top1++; top++;
    snap(18, `\`v[top++] = v1[top1++]\`: o ${x} vai para \`v[${at}]\`.`, { ptrs: true, mv: { [at]: "novo" } });
  }
  while (top2 < n2) {
    const x = V2[top2];
    v[top] = x; used2.add(top2);
    const at = top;
    top2++; top++;
    snap(23, `\`v[top++] = v2[top2++]\`: o ${x} vai para \`v[${at}]\`.`, { ptrs: true, mv: { [at]: "novo" } });
  }

  snap(21, `\`top2 < n2\`? \`${top2} < ${n2}\`? Não: o \`v2\` já tinha acabado. Nada a copiar.`, { ptrs: true });
  snap(25, "Fim do `merge`: o `v` ficou **ordenado** (`[1, 2, 2, 3, 4, 5, 7, 9]`). Cada elemento foi copiado uma vez, então o custo é `Θ(n1 + n2)`: linear!", { mv: Object.fromEntries(v.map((_, k) => [k, "achado"])) });
  return frames;
}

export const mergeIntercala: RowsSimData = {
  kind: "rows",
  title: "merge (intercalação)",
  code: CODE_MERGE,
  frames: buildMerge(),
};

/* ═══════════════════ ⚡ QuickSort: a partição ═══════════════════ */

export const V_PART = [4, 6, 1, 8, 2, 7, 3, 5];

const CODE_PART = String.raw`int particao(int v[], int p, int r)
{
    int pivo = v[p];
    int topo = p;
    for (int i = p + 1; i <= r; i++)
    {
        if (v[i] < pivo)
        {
            v[topo] = v[i];
            v[i] = v[topo + 1];
            topo++;
        }
    }
    v[topo] = pivo;
    return topo;
}`;

function buildPart() {
  const a = [...V_PART];
  const p = 0, r = a.length - 1;
  const frames: RowsFrame[] = [];
  let pivoRow: Slot[] = [null];
  let pivoMark: Marks = {};

  // zonas: [p, topo-1] = menores que o pivô (verde) · topo = "buraco" (apagado) · i = elemento sendo olhado (amarelo)
  const zonas = (topo: number, i?: number, over: Marks = {}): Marks => {
    const m: Marks = {};
    for (let k = p; k < topo; k++) m[k] = "achado";
    m[topo] = "descartado";
    if (i !== undefined) m[i] = "visitando";
    return { ...m, ...over };
  };

  const snap = (line: number, caption: string, marks: Marks, ptrs: Record<string, number>, vars: Record<string, string | number> = {}) =>
    frames.push({
      rows: [
        { label: "pivo", cells: cells(pivoRow, pivoMark) },
        { label: "v", cells: cells(a, marks), ptrs },
      ],
      vars, line, caption,
    });

  snap(1, `\`particao(v, ${p}, ${r})\`: vamos arrumar [${a.join(", ")}] em torno de um **pivô**: menores à esquerda, maiores à direita.`, {}, {}, { p, r });

  const pivo = a[p];
  pivoRow = [pivo];
  snap(3, `\`pivo = v[p]\`: guardamos o pivô (${pivo}) **fora do vetor**, na linha \`pivo\`.`, {}, {}, { pivo });

  let topo = p;
  snap(4, `\`topo = p\`: o \`topo\` marca o **buraco**, a posição onde vai entrar o próximo elemento menor que o pivô. Como o pivô foi guardado, a posição ${p} está livre (apagada no desenho).`, zonas(topo), { topo }, { pivo, topo });

  for (let i = p + 1; i <= r; i++) {
    const menor = a[i] < pivo;
    snap(7, `\`v[i] < pivo\`? \`${a[i]} < ${pivo}\`? ${menor ? "**Sim**: ele pertence à parte esquerda." : "Não: ele fica à direita do buraco, junto dos maiores."}`,
      zonas(topo, i), { topo, i }, { pivo, i, topo });
    if (!menor) continue;

    a[topo] = a[i];
    snap(9, `\`v[topo] = v[i]\`: o ${a[topo]} é copiado para o **buraco** (posição ${topo}) e passa a fazer parte dos menores.`,
      zonas(topo, i, { [topo]: "achado" }), { topo, i }, { pivo, i, topo });

    const mudou = topo + 1 !== i;
    a[i] = a[topo + 1];
    snap(10, mudou
      ? `\`v[i] = v[topo + 1]\`: o primeiro elemento **maior** (o ${a[i]}, da posição ${topo + 1}) é copiado para a posição ${i}, que acabou de ficar livre. Assim os maiores continuam juntos.`
      : `\`v[i] = v[topo + 1]\`: aqui \`topo + 1\` é o próprio \`i\`, então nada muda.`,
      zonas(topo, undefined, { [topo]: "achado", [i]: "novo" }), { topo, i }, { pivo, i, topo });

    topo++;
    snap(11, `\`topo++\`: o buraco anda uma posição para a frente (agora na posição ${topo}). O valor velho que ficou lá é lixo e será sobrescrito.`,
      zonas(topo), { topo, i }, { pivo, i, topo });
  }

  snap(5, `\`i <= r\`? \`${r + 1} <= ${r}\`? **Não**: todos os elementos foram examinados.`, zonas(topo), { topo }, { pivo, topo });

  a[topo] = pivo;
  pivoMark = { 0: "descartado" };
  snap(14, `\`v[topo] = pivo\`: o pivô entra no buraco (posição ${topo}). Agora tudo à esquerda é **menor** e tudo à direita é **maior** que ele.`,
    { ...Object.fromEntries(Array.from({ length: topo }, (_, k) => [k, "achado"])), [topo]: "novo" }, { topo }, { pivo, topo });

  snap(15, `\`return topo\`: devolve ${topo}. O pivô já está na **posição final** dele, e nunca mais precisa ser movido. 🎯 Agora basta ordenar o lado esquerdo e o lado direito.`,
    { ...Object.fromEntries(Array.from({ length: topo }, (_, k) => [k, "achado"])), [topo]: "novo" }, { topo }, { pivo, retorno: topo });
  return frames;
}

export const quickParticao: RowsSimData = {
  kind: "rows",
  title: "particao",
  code: CODE_PART,
  frames: buildPart(),
};

/* ═══════════════════ 🌳 MergeSort: árvore de chamadas ═══════════════════ */

export const VETOR_MERGE = [38, 27, 43, 3, 9, 82, 10]; // o vetor da Figura 9.6

const CODE_MS = String.raw`void mergeSort(int v[], int n)
{
    if (n > 1)
    {
        int n1 = n / 2;
        int n2 = n - n1;
        int *v1 = (int*)malloc(sizeof(int) * n1);
        int *v2 = (int*)malloc(sizeof(int) * n2);

        for (int i = 0; i < n1; i++)
        {
            v1[i] = v[i];
        }
        for (int i = 0; i < n2; i++)
        {
            v2[i] = v[n1 + i];
        }

        mergeSort(v1, n1);
        mergeSort(v2, n2);
        merge(v1, n1, v2, n2, v);
        free(v1);
        free(v2);
    }
}`;

function intercala(a: number[], b: number[]) {
  const out: number[] = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) out.push(a[i] < b[j] ? a[i++] : b[j++]);
  while (i < a.length) out.push(a[i++]);
  while (j < b.length) out.push(b[j++]);
  return out;
}

export function makeMergeTree(values: number[]): TreeSimData {
  const n = values.length;
  const nodes: TreeNode[] = [];
  const done = new Set<string>();
  let active = "";
  const frames: TreeFrame[] = [];

  const snap = (line: number, caption: string, vars: Record<string, string | number> = {}) =>
    frames.push({
      nodes: nodes.map((nd) => ({ ...nd, state: done.has(nd.id) ? "achado" : nd.id === active ? "visitando" : undefined })),
      vars, line, caption,
    });
  const fmt = (v: number[]) => `[${v.join(", ")}]`;

  const sort = (id: string, vals: number[]): number[] => {
    const node = nodes.find((x) => x.id === id)!;
    active = id;
    const len = vals.length;

    if (len <= 1) {
      done.add(id);
      snap(3, `\`mergeSort(v, ${len})\` com ${fmtLen(vals)}: \`n > 1\`? **Não**. Um vetor de 1 elemento **já está ordenado**: a função não faz nada e volta. ✅`, { n: len });
      return vals;
    }

    snap(3, `\`mergeSort(v, ${len})\` com ${fmt(vals)}: \`n > 1\`? Sim. Vamos dividir ao meio.`, { n: len });

    const n1 = Math.floor(len / 2), n2 = len - n1;
    const left: TreeNode = { id: id + "0", lo: node.lo, hi: node.lo + n1 - 1, depth: node.depth + 1, parent: id, values: vals.slice(0, n1) };
    const right: TreeNode = { id: id + "1", lo: node.lo + n1, hi: node.hi, depth: node.depth + 1, parent: id, values: vals.slice(n1) };
    nodes.push(left, right);
    snap(10, `\`n1 = n / 2 = ${n1}\` e \`n2 = n - n1 = ${n2}\`. As duas metades são **copiadas** para \`v1 = ${fmt(left.values)}\` e \`v2 = ${fmt(right.values)}\`.`, { n: len, n1, n2 });

    const a = sort(left.id, left.values);
    active = id;
    const b = sort(right.id, right.values);
    active = id;

    const merged = intercala(a, b);
    node.values = merged;
    done.add(id);
    snap(21, `\`merge(v1, v2, v)\`: intercala ${fmt(a)} e ${fmt(b)} em ${fmt(merged)}. Quem ordena de verdade é o **merge**, subindo da base para o topo. ✅`, { n: len });
    return merged;
  };

  const fmtLen = (v: number[]) => (v.length === 1 ? fmt(v) : "[]");

  nodes.push({ id: "r", lo: 0, hi: n - 1, depth: 0, values: [...values] });
  active = "r";
  snap(1, `\`mergeSort(v, ${n})\` com ${fmt(values)}. A chamada inicial é a **caixa de cima**; cada divisão cria duas caixas abaixo.`, { n });
  sort("r", [...values]);
  return { kind: "tree", title: "MergeSort: árvore de chamadas", code: CODE_MS, n, frames };
}

/* ═══════════════════ 🌳 QuickSort: árvore de chamadas ═══════════════════ */

export const VETOR_QUICK = [4, 2, 6, 1, 3, 5, 7];

const CODE_QS = String.raw`void quickSort(int v[], int p, int r)
{
    if (p < r)
    {
        int q = particao(v, p, r);
        quickSort(v, p, q - 1);
        quickSort(v, q + 1, r);
    }
}`;

export function makeQuickTree(values: number[]): TreeSimData {
  const n = values.length;
  const a = [...values];
  const nodes: TreeNode[] = [];
  const done = new Set<string>();
  let active = "";
  const frames: TreeFrame[] = [];

  const snap = (line: number, caption: string, vars: Record<string, string | number> = {}) =>
    frames.push({
      nodes: nodes.map((nd) => ({ ...nd, state: done.has(nd.id) ? "achado" : nd.id === active ? "visitando" : undefined })),
      vars, line, caption,
    });
  const fmt = (v: number[]) => `[${v.join(", ")}]`;

  // a mesma partição da apostila (pivô = primeiro elemento)
  const particao = (p: number, r: number) => {
    const pivo = a[p];
    let topo = p;
    for (let i = p + 1; i <= r; i++) {
      if (a[i] < pivo) {
        a[topo] = a[i];
        a[i] = a[topo + 1];
        topo++;
      }
    }
    a[topo] = pivo;
    return topo;
  };

  const sort = (id: string, p: number, r: number) => {
    const node = nodes.find((x) => x.id === id)!;
    active = id;

    if (!(p < r)) {
      done.add(id);
      snap(3, `\`quickSort(v, ${p}, ${r})\`: \`p < r\`? \`${p} < ${r}\`? **Não**: sobrou 1 elemento, que já está no lugar. ✅`, { p, r });
      return;
    }

    snap(3, `\`quickSort(v, ${p}, ${r})\` em ${fmt(a.slice(p, r + 1))}: \`p < r\`? Sim. Vamos particionar.`, { p, r });

    const pivo = a[p];
    const q = particao(p, r);
    node.values = a.slice(p, r + 1);
    node.cellStates = { [q]: "achado" };

    const kids: TreeNode[] = [];
    if (p <= q - 1) kids.push({ id: id + "0", lo: p, hi: q - 1, depth: node.depth + 1, parent: id, values: a.slice(p, q) });
    if (q + 1 <= r) kids.push({ id: id + "1", lo: q + 1, hi: r, depth: node.depth + 1, parent: id, values: a.slice(q + 1, r + 1) });
    nodes.push(...kids);

    const lado = (lo: number, hi: number) => (lo > hi ? "vazio" : `${hi - lo + 1} elemento${hi - lo > 0 ? "s" : ""}`);
    snap(5, `\`particao\` usa o pivô **${pivo}** e devolve \`q = ${q}\`: o ${pivo} já está na posição final (verde). À esquerda ficam **${lado(p, q - 1)}** e à direita **${lado(q + 1, r)}**.`, { p, r, q });

    if (p <= q - 1) { sort(id + "0", p, q - 1); active = id; }
    if (q + 1 <= r) { sort(id + "1", q + 1, r); active = id; }

    node.values = a.slice(p, r + 1);
    done.add(id);
    snap(8, `Fim desta chamada: o trecho ${fmt(node.values)} está **ordenado**. ✅`, { p, r });
  };

  nodes.push({ id: "r", lo: 0, hi: n - 1, depth: 0, values: [...values] });
  active = "r";
  snap(1, `\`quickSort(v, 0, ${n - 1})\` com ${fmt(values)}. Cada partição cria **no máximo** duas caixas abaixo (pode ser só uma, ou nenhuma).`, { p: 0, r: n - 1 });
  sort("r", 0, n - 1);
  return { kind: "tree", title: "QuickSort: árvore de chamadas", code: CODE_QS, n, frames };
}
