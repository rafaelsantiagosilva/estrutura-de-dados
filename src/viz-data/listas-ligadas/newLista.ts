import type { Sim } from "../types";

export const newLista: Sim = {
    title: "newLista",
    code: String.raw`// construtor da lista - cria uma nova lista na memória
Lista *newLista()
{
    Lista *li = (Lista*)malloc(sizeof(Lista));
    li->ini = NULL; // começa vazia
    return li;
}`,
    frames: [
        {
            nodes: [], head: null, line: 2,
            caption: "Chamamos `newLista()`. Ainda não existe lista nenhuma."
        },
        {
            nodes: [], head: null, vars: { li: "endereço da struct" }, line: 4,
            caption: "`malloc` reserva memória para a struct `Lista` (que só tem o `ini`). Mas o `ini` ainda tem **lixo**."
        },
        {
            nodes: [], head: null, line: 5,
            caption: "`li->ini = NULL`: o `ini` não aponta para nada. Esta é a **lista vazia**: a caixa `ini` e a seta para NULL."
        },
        {
            nodes: [], head: null, vars: { retorno: "li" }, line: 6,
            caption: "`return li`: devolvemos a lista pronta para receber nós. ✅"
        },
    ],
};