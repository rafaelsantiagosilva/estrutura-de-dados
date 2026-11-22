import type { Sim } from "../types";
import { makeList, mark, patch } from "../helpers";

const base = makeList(3, 5, 8); // a → b → c
const novo = { id: "n", value: 2, next: null, state: "novo" as const };
const L = [...base, novo];

export const addFim: Sim = {
    title: "addFim",
    code: String.raw`void addFim(Lista *li, int valor)
{
    No *no = newNo(valor);

    // lista vazia?
    if (li->ini == NULL)
    {
        li->ini = no; // começa a lista
    }
    else
    {
        No *aux;
        aux = li->ini;

        // até chegar no último nó
        while (aux->prox != NULL)
        {
            aux = aux->prox;
        }

        // aux agora é o último nó
        aux->prox = no;
    }
}`,
    frames: [
        {
            nodes: base, head: "a", vars: { valor: 2 }, line: 1,
            caption: "`addFim(li, 2)`: vamos inserir o 2 no final de [3, 5, 8]."
        },
        {
            nodes: L, head: "a", ptrs: { no: "n" }, line: 3,
            caption: "`newNo(2)` cria o nó. Ele ainda está solto."
        },
        {
            nodes: L, head: "a", ptrs: { no: "n" }, line: 6,
            caption: "`li->ini == NULL`? Falso, a lista tem nós. Vamos para o `else`."
        },
        {
            nodes: mark(L, { a: "visitando" }), head: "a", ptrs: { no: "n", aux: "a" }, line: 13,
            caption: "`aux` começa no primeiro nó."
        },
        {
            nodes: mark(L, { a: "visitando" }), head: "a", ptrs: { no: "n", aux: "a" }, line: 16,
            caption: "`aux->prox != NULL`? Sim (o 3 aponta para o 5). Continua andando."
        },
        {
            nodes: mark(L, { b: "visitando" }), head: "a", ptrs: { no: "n", aux: "b" }, line: 18,
            caption: "`aux = aux->prox`: andamos um nó."
        },
        {
            nodes: mark(L, { b: "visitando" }), head: "a", ptrs: { no: "n", aux: "b" }, line: 16,
            caption: "`aux->prox != NULL`? Sim (o 5 aponta para o 8)."
        },
        {
            nodes: mark(L, { c: "visitando" }), head: "a", ptrs: { no: "n", aux: "c" }, line: 18,
            caption: "`aux = aux->prox`: andamos mais um."
        },
        {
            nodes: mark(L, { c: "visitando" }), head: "a", ptrs: { no: "n", aux: "c" }, line: 16,
            caption: "`aux->prox != NULL`? **Não!** O 8 aponta para NULL. O laço termina."
        },
        {
            nodes: [...patch(mark(base, { c: "visitando" }), "c", { next: "n" }), novo],
            head: "a", ptrs: { no: "n", aux: "c" }, line: 22,
            caption: "`aux->prox = no`: o último nó passa a apontar para o novo. ✅"
        },
        {
            nodes: [...patch(base, "c", { next: "n" }), { id: "n", value: 2, next: null }],
            head: "a", line: 24,
            caption: "Fim: `aux` e `no` somem, e o 2 ficou no final da lista."
        },
    ],
};