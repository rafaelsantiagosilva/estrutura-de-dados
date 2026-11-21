import type { Sim, VizNode } from "../types";

const no = (value: number | string, state?: VizNode["state"]): VizNode =>
    ({ id: "n", value, next: null, state });

export const newNo: Sim = {
    title: "newNo",
    code: String.raw`// construtor do nó - cria um novo nó na memória
No *newNo(int valor)
{
    No *no = (No*)malloc(sizeof(No));
    no->valor = valor;
    no->prox = NULL; // não temos um outro valor
    return no;
}`,
    frames: [
        {
            nodes: [], head: null, vars: { valor: 7 }, line: 2,
            caption: "Chamamos `newNo(7)`. Ainda não existe nenhum nó."
        },
        {
            nodes: [no("?", "novo")], head: null, ptrs: { no: "n" }, line: 4,
            caption: "`malloc` reserva espaço na memória para um nó. O conteúdo é **lixo** (`?`) até alguém preencher."
        },
        {
            nodes: [no(7, "novo")], head: null, ptrs: { no: "n" }, line: 5,
            caption: "`no->valor = valor`: guardamos o 7 dentro do nó."
        },
        {
            nodes: [no(7, "novo")], head: null, ptrs: { no: "n" }, line: 6,
            caption: "`no->prox = NULL`: o nó nasce sem apontar para ninguém (por isso a seta para NULL)."
        },
        {
            nodes: [no(7, "novo")], head: null, ptrs: { no: "n" }, vars: { retorno: "endereço do nó" }, line: 7,
            caption: "`return no`: devolvemos o **endereço** do nó. Quem chamou decide onde encaixá-lo. ✅"
        },
    ],
};