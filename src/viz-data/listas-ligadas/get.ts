import type { Sim } from "../types";
import { makeList, mark } from "./helpers";

const base = makeList(3, 5, 8, 2);

export const get: Sim = {
    title: "get",
    code: String.raw`// devolve um apontador para o nó na posição idx (começa em 0)
No *get(Lista *li, int idx)
{
    No *aux = li->ini;

    // anda idx vezes
    for (int i = 0; i < idx; i++)
    {
        if (aux != NULL)
        {
            aux = aux->prox;
        }
    }

    // se saiu da lista, o índice era inválido
    if (aux == NULL)
    {
        printf("Fora dos limites\n");
        exit(1);
    }

    return aux;
}`,
    frames: [
        {
            nodes: base, head: "a", vars: { idx: 2 }, line: 2,
            caption: "`get(li, 2)`: queremos o nó da posição 2 da lista [3, 5, 8, 2]. A contagem começa em **0**."
        },
        {
            nodes: mark(base, { a: "visitando" }), head: "a", ptrs: { aux: "a" }, line: 4,
            caption: "`aux` começa na posição 0."
        },
        {
            nodes: mark(base, { a: "visitando" }), head: "a", ptrs: { aux: "a" }, vars: { i: 0 }, line: 7,
            caption: "`i = 0`. `0 < 2`? Sim, ainda precisamos andar."
        },
        {
            nodes: mark(base, { b: "visitando" }), head: "a", ptrs: { aux: "b" }, vars: { i: 0 }, line: 11,
            caption: "`aux != NULL`, então `aux = aux->prox`. Agora estamos na posição 1."
        },
        {
            nodes: mark(base, { b: "visitando" }), head: "a", ptrs: { aux: "b" }, vars: { i: 1 }, line: 7,
            caption: "`i++` vira 1. `1 < 2`? Sim, anda de novo."
        },
        {
            nodes: mark(base, { c: "visitando" }), head: "a", ptrs: { aux: "c" }, vars: { i: 1 }, line: 11,
            caption: "`aux = aux->prox`: posição 2."
        },
        {
            nodes: mark(base, { c: "visitando" }), head: "a", ptrs: { aux: "c" }, vars: { i: 2 }, line: 7,
            caption: "`i++` vira 2. `2 < 2`? **Não.** Saímos do `for`: andamos `idx` vezes."
        },
        {
            nodes: mark(base, { c: "visitando" }), head: "a", ptrs: { aux: "c" }, line: 16,
            caption: "`aux == NULL`? Não, o índice era válido. (Se fosse, o programa imprimiria o erro e encerraria.)"
        },
        {
            nodes: mark(base, { c: "achado" }), head: "a", ptrs: { aux: "c" }, vars: { retorno: "nó do 8" }, line: 22,
            caption: "`return aux`: devolvemos o **apontador** para o nó (não o valor). ✅ Custo: `O(n)`, pois pode andar a lista toda."
        },
    ],
};