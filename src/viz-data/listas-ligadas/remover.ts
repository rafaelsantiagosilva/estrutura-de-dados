import type { Sim } from "../types";
import { makeList, mark, patch } from "./helpers";

const base = makeList(3, 5, 8, 2); // a → b → c → d

// depois de `anterior->prox = anterior->prox->prox`
const pulado = patch(mark(base, { c: "removido" }), "b", { next: "d" });
// depois do free(no): o nó c deixa de existir
const livre = patch(base.filter((n) => n.id !== "c"), "b", { next: "d" });

export const remover: Sim = {
    title: "remover",
    code: String.raw`// remove o elemento da posição idx e devolve o valor removido
int remover(Lista *li, int idx)
{
    No *no; // nó que será removido
    if (idx == 0)
    {
        no = li->ini;
        li->ini = li->ini->prox; // o segundo vira o primeiro
    }
    else
    {
        No *anterior = get(li, idx - 1); // custo O(n)
        no = anterior->prox;
        anterior->prox = anterior->prox->prox; // pula o nó
    }

    int valor = no->valor;
    free(no); // devolve a memória (evita vazamento!)
    return valor;
}`,
    frames: [
        {
            nodes: base, head: "a", vars: { idx: 2 }, line: 2,
            caption: "`remover(li, 2)`: vamos remover o elemento da posição 2 (o valor 8)."
        },
        {
            nodes: base, head: "a", line: 5,
            caption: "`idx == 0`? Não, então a remoção é no meio da lista: vamos para o `else`."
        },
        {
            nodes: mark(base, { b: "visitando" }), head: "a", ptrs: { anterior: "b" }, line: 12,
            caption: "`get(li, idx - 1)` caminha até a posição 1 e devolve o nó **anterior** ao que será removido."
        },
        {
            nodes: mark(base, { b: "visitando", c: "removido" }), head: "a",
            ptrs: { anterior: "b", no: "c" }, line: 13,
            caption: "`no` guarda o nó que será removido (o do valor 8)."
        },
        {
            nodes: pulado, head: "a", ptrs: { anterior: "b", no: "c" }, line: 14,
            caption: "`anterior->prox` agora pula o nó: o 5 aponta direto para o 2. O nó 8 ficou fora da lista."
        },
        {
            nodes: pulado, head: "a", ptrs: { anterior: "b", no: "c" }, vars: { valor: 8 }, line: 17,
            caption: "Guardamos o valor do nó antes de liberá-lo."
        },
        {
            nodes: livre, head: "a", ptrs: { anterior: "b" }, line: 18,
            caption: "`free(no)` devolve a memória. Sem isso teríamos um **vazamento**! 💧"
        },
        {
            nodes: livre, head: "a", vars: { retorno: 8 }, line: 19,
            caption: "Devolve o 8. A lista agora é [3, 5, 2]. ✅"
        },
    ],
};