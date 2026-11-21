import type { Sim } from "../types";
import { makeList, mark, patch } from "./helpers";

const base = makeList(3, 5, 8, 2); // a → b → c → d
const novo = (next: string | null) => ({ id: "n", value: 7, next, state: "novo" as const });

export const add: Sim = {
    title: "add",
    code: String.raw`// insere o valor na posição idx; os demais "andam" para a direita
void add(Lista *li, int valor, int idx)
{
    No *no = newNo(valor);

    if (idx == 0)
    {
        no->prox = li->ini;
        li->ini = no;
    }
    else
    {
        No *anterior = get(li, idx - 1);
        no->prox = anterior->prox; // 1º: o novo nó segura o resto da lista
        anterior->prox = no;       // 2º: o anterior passa a apontar para o novo
    }
}`,
    frames: [
        {
            nodes: base, head: "a", vars: { valor: 7, idx: 2 }, line: 2,
            caption: "`add(li, 7, 2)`: inserir o 7 na posição 2 da lista [3, 5, 8, 2]."
        },
        {
            nodes: [...base, novo(null)], head: "a", ptrs: { no: "n" }, line: 4,
            caption: "`newNo(7)` cria o nó solto."
        },
        {
            nodes: [...base, novo(null)], head: "a", ptrs: { no: "n" }, line: 6,
            caption: "`idx == 0`? Não. A inserção é no meio, então vamos para o `else`."
        },
        {
            nodes: mark([...base, novo(null)], { b: "visitando" }), head: "a", ptrs: { no: "n", anterior: "b" }, line: 13,
            caption: "`get(li, idx - 1)` devolve o nó da posição **1** (o 5): o que ficará **antes** do novo."
        },
        {
            nodes: mark([...base, novo("c")], { b: "visitando" }), head: "a", ptrs: { no: "n", anterior: "b" }, line: 14,
            caption: "**1º passo:** o novo nó aponta para o 8, quem vem depois do `anterior`. Agora ele já \"segura\" o resto da lista."
        },
        {
            nodes: patch(mark([...base, novo("c")], { b: "visitando" }), "b", { next: "n" }),
            head: "a", ptrs: { no: "n", anterior: "b" }, line: 15,
            caption: "**2º passo:** o `anterior` passa a apontar para o novo nó. O 7 entrou na cadeia. ✅"
        },
        {
            nodes: patch([...base, { id: "n", value: 7, next: "c" }], "b", { next: "n" }),
            head: "a", line: 17,
            caption: "Fim: a lista é [3, 5, 7, 8, 2]. Os nós da frente \"andaram\" para a direita só no desenho: na memória nenhum se moveu."
        },
    ],
};