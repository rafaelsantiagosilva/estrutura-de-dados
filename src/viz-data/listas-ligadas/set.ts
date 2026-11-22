import type { Sim } from "../types";
import { makeList, mark, patch } from "../helpers";

const base = makeList(3, 5, 8, 2);

export const set: Sim = {
    title: "set",
    code: String.raw`// substitui o valor da posição idx pelo parâmetro 'valor'
void set(Lista *li, int valor, int idx)
{
    No *aux = get(li, idx); // acha o nó (custo O(n))
    aux->valor = valor;     // troca o valor (custo Θ(1))
}`,
    frames: [
        {
            nodes: base, head: "a", vars: { valor: 9, idx: 2 }, line: 2,
            caption: "`set(li, 9, 2)`: trocar o valor da posição 2 (o 8) por 9."
        },
        {
            nodes: mark(base, { a: "visitando" }), head: "a", ptrs: { aux: "a" }, line: 4,
            caption: "`get(li, 2)` começa a caminhar pela lista..."
        },
        {
            nodes: mark(base, { b: "visitando" }), head: "a", ptrs: { aux: "b" }, line: 4,
            caption: "...passa pela posição 1..."
        },
        {
            nodes: mark(base, { c: "achado" }), head: "a", ptrs: { aux: "c" }, line: 4,
            caption: "...e chega na posição 2. `aux` recebe o apontador do nó. Essa caminhada é a parte cara: `O(n)`."
        },
        {
            nodes: patch(base, "c", { value: 9, state: "achado" }), head: "a", ptrs: { aux: "c" }, line: 5,
            caption: "`aux->valor = valor`: trocamos o 8 por 9 direto no nó. Isso é `Θ(1)`. ✅"
        },
        {
            nodes: patch(base, "c", { value: 9 }), head: "a", line: 6,
            caption: "Fim: a lista agora é [3, 5, 9, 2]. Nenhum ponteiro mudou, só um valor."
        },
    ],
};