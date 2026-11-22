import type { Sim } from "../types";
import { makeList, mark } from "../helpers";

const base = makeList(3, 5, 8, 2);

export const busca: Sim = {
    title: "busca",
    code: String.raw`// devolve 1 se k pertence à lista, 0 caso contrário
int busca(Lista *li, int k)
{
    No *aux = li->ini;
    while (aux != NULL)
    {
        if (aux->valor == k)
        {
            return 1; // achou
        }
        aux = aux->prox; // próximo nó, sem recomeçar do zero
    }

    return 0; // chegou no fim sem achar
}`,
    frames: [
        {
            nodes: base, head: "a", vars: { k: 8 }, line: 2,
            caption: "`busca(li, 8)`: o valor 8 pertence à lista [3, 5, 8, 2]?"
        },
        {
            nodes: mark(base, { a: "visitando" }), head: "a", ptrs: { aux: "a" }, line: 4,
            caption: "`aux` começa no primeiro nó."
        },
        {
            nodes: mark(base, { a: "visitando" }), head: "a", ptrs: { aux: "a" },
            vars: { "aux->valor": 3 }, line: 7,
            caption: "`3 == 8`? Não."
        },
        {
            nodes: mark(base, { b: "visitando" }), head: "a", ptrs: { aux: "b" }, line: 11,
            caption: "`aux = aux->prox`: próximo nó."
        },
        {
            nodes: mark(base, { b: "visitando" }), head: "a", ptrs: { aux: "b" },
            vars: { "aux->valor": 5 }, line: 7,
            caption: "`5 == 8`? Não."
        },
        {
            nodes: mark(base, { c: "visitando" }), head: "a", ptrs: { aux: "c" }, line: 11,
            caption: "`aux = aux->prox`: próximo nó."
        },
        {
            nodes: mark(base, { c: "achado" }), head: "a", ptrs: { aux: "c" },
            vars: { "aux->valor": 8 }, line: 7,
            caption: "`8 == 8`? **Sim!** 🎉"
        },
        {
            nodes: mark(base, { c: "achado" }), head: "a", ptrs: { aux: "c" },
            vars: { retorno: 1 }, line: 9,
            caption: "`return 1`: achamos, e nem precisamos olhar o último nó."
        },
    ],
};