import type { Sim } from "../types";
import { makeList } from "../helpers";

const base = makeList(3, 5); // a(3) → b(5)
const novo = (next: string | null) => ({ id: "n", value: 7, next, state: "novo" as const });

export const addInicio: Sim = {
    title: "addInicio",
    code: String.raw`// insere o valor na primeira posição
void addInicio(Lista *li, int valor)
{
    No *no = newNo(valor);

    no->prox = li->ini; // o novo nó aponta para quem era o primeiro
    li->ini = no;       // o novo nó vira o primeiro
}`,
    frames: [
        {
            nodes: base, head: "a", vars: { valor: 7 }, line: 2,
            caption: "Chamamos `addInicio(li, 7)` em uma lista [3, 5]."
        },
        {
            nodes: [...base, novo(null)], head: "a", ptrs: { no: "n" }, line: 4,
            caption: "`newNo(7)` cria um nó solto na memória. A variável `no` aponta para ele."
        },
        {
            nodes: [...base, novo("a")], head: "a", ptrs: { no: "n" }, line: 6,
            caption: "`no->prox = li->ini`: o novo nó passa a apontar para o antigo primeiro."
        },
        {
            nodes: [...base, novo("a")], head: "n", ptrs: { no: "n" }, line: 7,
            caption: "`li->ini = no`: a lista agora começa no novo nó. ✅"
        },
        {
            nodes: [...base, { id: "n", value: 7, next: "a" }], head: "n", line: 8,
            caption: "A função termina: a variável local `no` some, mas o nó continua na lista."
        },
    ],
};