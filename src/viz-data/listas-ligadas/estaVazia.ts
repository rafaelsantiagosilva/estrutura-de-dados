import type { Sim } from "../types";
import { makeList } from "./helpers";

const cheia = makeList(3, 5);

export const estaVazia: Sim = {
    title: "estaVazia",
    code: String.raw`// retorna 1 se está vazia - nenhum elemento foi adicionado
int estaVazia(Lista *li)
{
    // tá sem nó no início?
    return li->ini == NULL;
}`,
    frames: [
        {
            nodes: [], head: null, line: 2,
            caption: "**Chamada 1:** `estaVazia(li)` com a lista vazia."
        },
        {
            nodes: [], head: null, vars: { retorno: 1 }, line: 5,
            caption: "`li->ini == NULL`? **Sim.** A comparação vale 1 (verdadeiro), então a lista está vazia."
        },
        {
            nodes: cheia, head: "a", vars: { retorno: "—" }, line: 2,
            caption: "**Chamada 2:** agora com a lista [3, 5]."
        },
        {
            nodes: cheia, head: "a", vars: { retorno: 0 }, line: 5,
            caption: "`li->ini == NULL`? **Não**, o `ini` aponta para o nó 3. A comparação vale 0 (falso). ✅"
        },
    ],
};