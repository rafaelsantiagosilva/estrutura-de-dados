import type { Sim } from "../types";
import { makeList, mark, patch } from "../helpers";

const base = makeList(2, 5, 8, 12); // lista já ordenada
const novo = (next: string | null) => ({ id: "n", value: 7, next, state: "novo" as const });

export const addOrdenado: Sim = {
    title: "addOrdenado",
    code: String.raw`// insere o valor na lista de maneira ordenada (crescente)
void addOrdenado(Lista *li, int valor)
{
    No *no = newNo(valor);

    // lista vazia OU valor é menor/igual ao primeiro: entra no começo
    if (li->ini == NULL || valor <= li->ini->valor)
    {
        no->prox = li->ini;
        li->ini = no;
    }
    else
    {
        No *aux = li->ini;

        // para no último nó cujo PRÓXIMO ainda é menor que valor
        while (aux->prox != NULL && aux->prox->valor < valor)
        {
            aux = aux->prox;
        }

        no->prox = aux->prox; // 1º: segura o resto
        aux->prox = no;       // 2º: encaixa
    }
}`,
    frames: [
        {
            nodes: base, head: "a", vars: { valor: 7 }, line: 2,
            caption: "`addOrdenado(li, 7)` na lista ordenada [2, 5, 8, 12]. O 7 precisa ficar entre o 5 e o 8."
        },
        {
            nodes: [...base, novo(null)], head: "a", ptrs: { no: "n" }, line: 4,
            caption: "`newNo(7)` cria o nó solto."
        },
        {
            nodes: [...base, novo(null)], head: "a", ptrs: { no: "n" }, vars: { "ini->valor": 2 }, line: 7,
            caption: "Lista vazia? Não. `7 <= 2`? Não. Então o 7 **não** entra no começo: vamos para o `else`."
        },
        {
            nodes: mark([...base, novo(null)], { a: "visitando" }), head: "a", ptrs: { no: "n", aux: "a" }, line: 14,
            caption: "`aux` começa no primeiro nó."
        },
        {
            nodes: mark([...base, novo(null)], { a: "visitando" }), head: "a", ptrs: { no: "n", aux: "a" },
            vars: { "aux->prox->valor": 5 }, line: 17,
            caption: "Olhamos o **próximo** nó: `5 < 7`? Sim, então o 7 vem depois dele. Continua andando."
        },
        {
            nodes: mark([...base, novo(null)], { b: "visitando" }), head: "a", ptrs: { no: "n", aux: "b" }, line: 19,
            caption: "`aux = aux->prox`: agora estamos no 5."
        },
        {
            nodes: mark([...base, novo(null)], { b: "visitando" }), head: "a", ptrs: { no: "n", aux: "b" },
            vars: { "aux->prox->valor": 8 }, line: 17,
            caption: "`8 < 7`? **Não.** O laço para: o 7 deve ficar logo depois do `aux` (o 5)."
        },
        {
            nodes: mark([...base, novo("c")], { b: "visitando" }), head: "a", ptrs: { no: "n", aux: "b" }, line: 22,
            caption: "**1º passo:** o novo nó aponta para o 8."
        },
        {
            nodes: patch(mark([...base, novo("c")], { b: "visitando" }), "b", { next: "n" }),
            head: "a", ptrs: { no: "n", aux: "b" }, line: 23,
            caption: "**2º passo:** o 5 passa a apontar para o novo nó. A lista continua ordenada! ✅"
        },
        {
            nodes: patch([...base, { id: "n", value: 7, next: "c" }], "b", { next: "n" }),
            head: "a", line: 25,
            caption: "Fim: [2, 5, 7, 8, 12]."
        },
    ],
};