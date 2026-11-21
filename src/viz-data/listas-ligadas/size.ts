import type { Sim } from "../types";
import { makeList, mark } from "./helpers";

const base = makeList(3, 5, 8);

export const size: Sim = {
    title: "size",
    code: String.raw`// conta até achar o nó final (nó que aponta para NULL)
int size(Lista *li)
{
    int size = 0;

    // nó auxiliar: vamos percorrer a lista usando ele
    No *aux = li->ini;

    while (aux != NULL)
    {
        aux = aux->prox;
        size++;
    } // quando chegar em NULL acaba

    return size;
}`,
    frames: [
        {
            nodes: base, head: "a", line: 2,
            caption: "`size(li)` com a lista [3, 5, 8]. Vamos contar os nós andando um a um."
        },
        {
            nodes: base, head: "a", vars: { size: 0 }, line: 4,
            caption: "O contador começa em 0."
        },
        {
            nodes: mark(base, { a: "visitando" }), head: "a", ptrs: { aux: "a" }, line: 7,
            caption: "`aux` começa no primeiro nó."
        },
        {
            nodes: mark(base, { a: "visitando" }), head: "a", ptrs: { aux: "a" }, line: 9,
            caption: "`aux != NULL`? Sim, existe um nó. Entramos no laço."
        },
        {
            nodes: mark(base, { b: "visitando" }), head: "a", ptrs: { aux: "b" }, line: 11,
            caption: "`aux = aux->prox`: andamos um nó."
        },
        {
            nodes: mark(base, { b: "visitando" }), head: "a", ptrs: { aux: "b" }, vars: { size: 1 }, line: 12,
            caption: "`size++`: contamos o primeiro nó. size = 1."
        },
        {
            nodes: mark(base, { c: "visitando" }), head: "a", ptrs: { aux: "c" }, line: 11,
            caption: "Segunda volta: `aux` anda para o nó 8."
        },
        {
            nodes: mark(base, { c: "visitando" }), head: "a", ptrs: { aux: "c" }, vars: { size: 2 }, line: 12,
            caption: "size = 2."
        },
        {
            nodes: base, head: "a", ptrs: { aux: null }, line: 11,
            caption: "Terceira volta: `aux` anda para além do último nó e passa a valer `NULL`."
        },
        {
            nodes: base, head: "a", ptrs: { aux: null }, vars: { size: 3 }, line: 12,
            caption: "size = 3."
        },
        {
            nodes: base, head: "a", ptrs: { aux: null }, line: 9,
            caption: "`aux != NULL`? **Não.** O laço termina."
        },
        {
            nodes: base, head: "a", vars: { retorno: 3 }, line: 15,
            caption: "`return size`: a lista tem 3 nós. ✅ Percorremos tudo, por isso o custo é `Θ(n)`."
        },
    ],
};