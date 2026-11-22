import type { ArrayFrame, ArraySimData, Cell, NodeState } from "../types";

const CAP = 7; // o vetor tem 7 posições; `n` diz quantas estão em uso

type Slot = number | null;
type Marks = Record<number, NodeState>;

// fotografia do vetor: posições vazias viram `null`
const cells = (v: Slot[], marks: Marks = {}): (Cell | null)[] =>
  v.map((value, k) => (value === null ? null : { value, state: marks[k] }));

/* ───────── inserir na posição idx ───────── */

function buildInserir() {
  const frames: ArrayFrame[] = [];
  const v: Slot[] = [4, 7, 9, 1, null, null, null];
  const n = 4, valor = 5, idx = 1;
  const add = (line: number, caption: string, ptrs: Record<string, number>, vars: Record<string, string | number>, marks: Marks = {}) =>
    frames.push({ cells: cells(v, marks), ptrs, vars, line, caption });

  add(2, "`inserir(v, 4, 5, 1)`: o vetor tem [4, 7, 9, 1] e queremos o 5 na posição 1. Os que estão à direita precisam **abrir espaço**.",
    { idx }, { n, valor, idx });

  for (let i = n; i > idx; i--) {
    add(4, `\`i > idx\`? \`${i} > ${idx}\`? Sim: ainda falta empurrar o elemento da posição ${i - 1}.`, { idx, i }, { i });
    v[i] = v[i - 1];
    add(6, `\`v[${i}] = v[${i - 1}]\`: o ${v[i]} é **copiado** uma posição para a direita. (Começamos pelo fim, para não sobrescrever ninguém!)`,
      { idx, i }, { i }, { [i - 1]: "visitando", [i]: "novo" });
  }

  add(4, `\`i > idx\`? \`${idx} > ${idx}\`? Não: já abrimos o espaço. A posição ${idx} está livre (o 7 foi copiado para a ${idx + 1}).`,
    { idx, i: idx }, { i: idx }, { [idx]: "removido" });

  v[idx] = valor;
  add(9, "`v[idx] = valor`: o 5 entra no espaço aberto. ✅", { idx }, {}, { [idx]: "novo" });

  add(10, "`return n + 1`: o vetor passa a ter 5 elementos: [4, 5, 7, 9, 1]. No pior caso (`idx = 0`) empurramos **todos** os elementos: `Θ(n)`.",
    {}, { retorno: n + 1 });
  return frames;
}

export const vetInserir: ArraySimData = {
  kind: "array",
  title: "inserir (vetor)",
  capacity: CAP,
  orientation: "horizontal",
  code: String.raw`// insere valor na posicao idx e devolve o novo tamanho
int inserir(int v[], int n, int valor, int idx)
{
    for (int i = n; i > idx; i--)
    {
        v[i] = v[i-1]; // empurra para a direita
    }

    v[idx] = valor;
    return n + 1;
}`,
  frames: buildInserir(),
};

/* ───────── remover da posição idx ───────── */

function buildRemover() {
  const frames: ArrayFrame[] = [];
  const v: Slot[] = [4, 5, 7, 9, 1, null, null];
  const n = 5, idx = 1;
  const add = (line: number, caption: string, ptrs: Record<string, number>, vars: Record<string, string | number>, marks: Marks = {}) =>
    frames.push({ cells: cells(v, marks), ptrs, vars, line, caption });

  add(2, "`removerVet(v, 5, 1)`: o vetor tem [4, 5, 7, 9, 1] e queremos tirar o 5 (posição 1). Os que estão à direita vão **puxar** para a esquerda.",
    { idx }, { n, idx }, { [idx]: "removido" });

  for (let i = idx; i < n - 1; i++) {
    add(4, `\`i < n - 1\`? \`${i} < ${n - 1}\`? Sim: o elemento da posição ${i + 1} precisa vir para a ${i}.`, { idx, i }, { i }, { [idx]: "removido" });
    v[i] = v[i + 1];
    add(6, `\`v[${i}] = v[${i + 1}]\`: o ${v[i]} é copiado uma posição para a esquerda, **por cima** do elemento removido. (Começamos pelo início, para não sobrescrever ninguém!)`,
      { idx, i }, { i }, { [i]: "novo", [i + 1]: "visitando" });
  }

  add(4, `\`i < n - 1\`? \`${n - 1} < ${n - 1}\`? Não: acabou.`, { idx, i: n - 1 }, { i: n - 1 });
  add(9, "`return n - 1`: o vetor passa a ter 4 elementos: [4, 7, 9, 1]. A última posição ainda guarda um 1 repetido, mas está **fora** do tamanho `n`, então não faz mais parte da lista.",
    {}, { retorno: n - 1 }, { [n - 1]: "removido" });
  return frames;
}

export const vetRemover: ArraySimData = {
  kind: "array",
  title: "removerVet (vetor)",
  capacity: CAP,
  orientation: "horizontal",
  code: String.raw`// remove o elemento da posicao idx e devolve o novo tamanho
int removerVet(int v[], int n, int idx)
{
    for (int i = idx; i < n - 1; i++)
    {
        v[i] = v[i+1]; // puxa para a esquerda
    }

    return n - 1;
}`,
  frames: buildRemover(),
};
