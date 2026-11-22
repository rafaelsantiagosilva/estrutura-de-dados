import type { Sim } from "../types";
import { makeList, mark } from "../helpers";

const base = makeList(3, 5, 8);

export const printLista: Sim = {
    title: "printLista",
    code: String.raw`// imprime a lista
void printLista(Lista *li)
{
    printf("[");

    // nó auxiliar: vamos percorrer a lista usando ele
    No *aux = li->ini;

    while (aux != NULL)
    {
        printf("%d", aux->valor);

        aux = aux->prox;

        if (aux != NULL)
        {
            printf(", ");
        }
    }

    printf("]");

    // imprime o tamanho da lista
    printf("(%d)\n", size(li));
}`,
    frames: [
        {
            nodes: base, head: "a", vars: { tela: "" }, line: 2,
            caption: "`printLista(li)` com [3, 5, 8]. Acompanhe o que aparece na `tela`."
        },
        {
            nodes: base, head: "a", vars: { tela: "[" }, line: 4,
            caption: "Imprime o colchete de abertura."
        },
        {
            nodes: mark(base, { a: "visitando" }), head: "a", ptrs: { aux: "a" }, line: 7,
            caption: "`aux` começa no primeiro nó."
        },
        {
            nodes: mark(base, { a: "visitando" }), head: "a", ptrs: { aux: "a" }, vars: { tela: "[3" }, line: 11,
            caption: "`aux != NULL`, então imprime o valor do nó: 3."
        },
        {
            nodes: mark(base, { b: "visitando" }), head: "a", ptrs: { aux: "b" }, line: 13,
            caption: "`aux = aux->prox`: anda para o nó 5."
        },
        {
            nodes: mark(base, { b: "visitando" }), head: "a", ptrs: { aux: "b" }, vars: { tela: "[3, " }, line: 17,
            caption: "`aux != NULL`? Sim, ainda tem nó pela frente, então imprime a vírgula."
        },
        {
            nodes: mark(base, { b: "visitando" }), head: "a", ptrs: { aux: "b" }, vars: { tela: "[3, 5" }, line: 11,
            caption: "Próxima volta: imprime o 5."
        },
        {
            nodes: mark(base, { c: "visitando" }), head: "a", ptrs: { aux: "c" }, line: 13,
            caption: "`aux` anda para o nó 8."
        },
        {
            nodes: mark(base, { c: "visitando" }), head: "a", ptrs: { aux: "c" }, vars: { tela: "[3, 5, " }, line: 17,
            caption: "Ainda tem nó (o 8), então imprime a vírgula."
        },
        {
            nodes: mark(base, { c: "visitando" }), head: "a", ptrs: { aux: "c" }, vars: { tela: "[3, 5, 8" }, line: 11,
            caption: "Imprime o 8."
        },
        {
            nodes: base, head: "a", ptrs: { aux: null }, line: 13,
            caption: "`aux = aux->prox`: passou do último nó, `aux` vale `NULL`."
        },
        {
            nodes: base, head: "a", ptrs: { aux: null }, line: 15,
            caption: "`aux != NULL`? **Não.** Por isso **não** imprime vírgula depois do último valor."
        },
        {
            nodes: base, head: "a", vars: { tela: "[3, 5, 8]" }, line: 21,
            caption: "O laço terminou. Imprime o colchete de fechamento."
        },
        {
            nodes: base, head: "a", vars: { tela: "[3, 5, 8](3)" }, line: 24,
            caption: "Chama `size(li)` (que percorre a lista de novo!) e imprime o tamanho. ✅"
        },
    ],
};