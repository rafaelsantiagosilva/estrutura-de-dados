import type { ArrayFrame, ArraySimData } from "../types";

/**
 * Simulações de PILHA COM VETOR (ArraySim, orientação vertical).
 *
 * Convenção desta página: o marcador `top` aponta para a PRIMEIRA POSIÇÃO LIVRE
 * (como na apostila: top = nº de elementos = primeira posição livre).
 * Quando a pilha está cheia (top == capacidade) não existe posição livre,
 * então o marcador simplesmente some.
 *
 * Os valores "removidos" por pop continuam no vetor (remoção lógica), e por isso
 * continuam desenhados, só que acima do `top`.
 */

type Cells = ArrayFrame["cells"];
type Ptrs = NonNullable<ArrayFrame["ptrs"]>;
type Vars = NonNullable<ArrayFrame["vars"]>;

/** c(3, 5, null) -> células com 3 e 5; null = vazia. */
const c = (...values: (number | null)[]): Cells =>
    values.map((value) => (value === null ? null : { value }));

function frame(line: number, caption: string, cells: Cells, ptrs?: Ptrs, vars?: Vars): ArrayFrame {
    return { line, caption, cells, ...(ptrs && { ptrs }), ...(vars && { vars }) };
}

/* ───────────────────────── push (versão global) ───────────────────────── */

export const pilhaVetorPush: ArraySimData = {
    kind: "array",
    title: "Pilha com vetor · push",
    orientation: "vertical",
    capacity: 5,
    code: `#define MAX 5

int top = 0;
int v[MAX];

void push(int x)
{
    v[top++] = x;
}

int main()
{
    push(3);
    push(5);
    push(7);
}`,
    frames: [
        frame(3, "Começamos com `top = 0`: a pilha está vazia e a primeira posição livre é a `[0]`.", c(), { top: 0 }, { top: 0 }),

        frame(13, "A `main` chama `push(3)`: o parâmetro `x` recebe `3`.", c(), { top: 0 }, { x: 3 }),
        frame(8, "`v[top++] = x` usa o `top` atual (`0`) como índice: o `3` é guardado em `v[0]`.", c(3), { top: 0 }),
        frame(8, "Só depois da escrita acontece o `top++`: `top` passa de `0` para `1`.", c(3), { top: 1 }, { top: 1 }),

        frame(14, "A `main` chama `push(5)`.", c(3), { top: 1 }, { x: 5 }),
        frame(8, "O `5` vai para `v[top]`, ou seja, `v[1]`. Ele fica em cima do `3`.", c(3, 5), { top: 1 }),
        frame(8, "`top++`: agora `top = 2`.", c(3, 5), { top: 2 }, { top: 2 }),

        frame(15, "A `main` chama `push(7)`.", c(3, 5), { top: 2 }, { x: 7 }),
        frame(8, "O `7` vai para `v[2]`.", c(3, 5, 7), { top: 2 }),
        frame(8, "`top++`: agora `top = 3`.", c(3, 5, 7), { top: 3 }, { top: 3 }),

        frame(
            16,
            "Pronto: 3 elementos na pilha (`3`, `5`, `7`). O `top = 3` significa, ao mesmo tempo, 3 elementos e primeira posição livre em `[3]`.",
            c(3, 5, 7),
            { top: 3 },
        ),
    ],
};

/* ───────────────────────── pop (versão global) ───────────────────────── */

export const pilhaVetorPop: ArraySimData = {
    kind: "array",
    title: "Pilha com vetor · pop",
    orientation: "vertical",
    capacity: 5,
    code: `int pop()
{
    return v[--top];
}

int main()
{
    printf("%d\\n", pop());
    printf("%d\\n", pop());
    printf("%d\\n", pop());
}`,
    frames: [
        frame(6, "A pilha já tem `3`, `5` e `7` (empilhados nessa ordem) e `top = 3`.", c(3, 5, 7), { top: 3 }, { top: 3 }),

        frame(8, "A `main` chama `pop()` pela primeira vez.", c(3, 5, 7), { top: 3 }),
        frame(3, "`--top` decrementa antes de usar: `top` passa de `3` para `2`.", c(3, 5, 7), { top: 2 }, { top: 2 }),
        frame(
            8,
            "`pop` devolve `v[2]`, que vale `7`, e o `printf` imprime. O `7` continua no vetor, mas está acima do `top`: saiu da pilha.",
            c(3, 5, 7),
            { top: 2 },
            { saida: "7" },
        ),

        frame(9, "Segundo `pop()`.", c(3, 5, 7), { top: 2 }),
        frame(3, "`--top`: `top` passa de `2` para `1`.", c(3, 5, 7), { top: 1 }, { top: 1 }),
        frame(9, "Devolve `v[1] = 5` e imprime. O último a entrar (antes do `7`) é o próximo a sair.", c(3, 5, 7), { top: 1 }, { saida: "7 5" }),

        frame(10, "Terceiro `pop()`.", c(3, 5, 7), { top: 1 }),
        frame(3, "`--top`: `top` passa de `1` para `0`.", c(3, 5, 7), { top: 0 }, { top: 0 }),
        frame(10, "Devolve `v[0] = 3` e imprime.", c(3, 5, 7), { top: 0 }, { saida: "7 5 3" }),

        frame(
            11,
            "Saiu `7 5 3`, o inverso da ordem de entrada (cada número em uma linha). Com `top = 0` a pilha está vazia, embora os valores antigos ainda estejam no vetor.",
            c(3, 5, 7),
            { top: 0 },
        ),
    ],
};

/* ───────────────────────── newPilha (versão com struct) ───────────────────────── */

export const pilhaVetorNew: ArraySimData = {
    kind: "array",
    title: "Pilha com vetor · newPilha",
    orientation: "vertical",
    capacity: 3,
    code: `typedef struct Pilha
{
    int *v;
    int max, top;
} Pilha;

Pilha *newPilha(int max)
{
    Pilha *p = (Pilha *)malloc(sizeof(Pilha));
    p->v = (int *)malloc(sizeof(int) * max);
    p->max = max;
    p->top = 0;
    return p;
}`,
    frames: [
        frame(7, "Chamamos `newPilha(3)`: queremos uma pilha com capacidade para 3 elementos.", c(), undefined, { max: 3 }),
        frame(9, "O primeiro `malloc` reserva a struct `Pilha`, que guarda o vetor `v`, o `max` e o `top`.", c()),
        frame(
            10,
            "O segundo `malloc` reserva o vetor: espaço para `max` inteiros. As posições existem, mas o conteúdo é lixo (não é zerado). Tudo bem: ninguém lê uma posição antes de um `push`.",
            c(),
        ),
        frame(11, "`p->max = max`: guardamos a capacidade para poder testar se a pilha enche.", c()),
        frame(12, "`p->top = 0`: pilha vazia, e a primeira posição livre é a `[0]`.", c(), { top: 0 }, { top: 0 }),
        frame(13, "`return p`: devolvemos o endereço da pilha pronta para uso.", c(), { top: 0 }),
    ],
};

/* ───────────────────────── push com teste de pilha cheia ───────────────────────── */

export const pilhaVetorCheia: ArraySimData = {
    kind: "array",
    title: "Pilha com vetor · pilha cheia",
    orientation: "vertical",
    capacity: 3,
    code: `void push(Pilha *p, int x)
{
    if (p->top == p->max)
    {
        printf("Erro: Pilha cheia\\n");
        exit(1);
    }
    p->v[p->top++] = x;
}

int main()
{
    Pilha *p = newPilha(3);
    push(p, 3);
    push(p, 5);
    push(p, 7);
    push(p, 9);
}`,
    frames: [
        frame(13, "`newPilha(3)`: capacidade `3`, pilha vazia (`top = 0`).", c(), { top: 0 }, { max: 3, top: 0 }),

        frame(3, "`push(p, 3)`: o teste `top == max` dá `0 == 3`, falso. Ainda há espaço.", c(), { top: 0 }),
        frame(8, "O `3` entra em `v[0]` e `top` vira `1`.", c(3), { top: 1 }, { top: 1 }),

        frame(3, "`push(p, 5)`: `1 == 3`, falso.", c(3), { top: 1 }),
        frame(8, "O `5` entra em `v[1]` e `top` vira `2`.", c(3, 5), { top: 2 }, { top: 2 }),

        frame(3, "`push(p, 7)`: `2 == 3`, falso.", c(3, 5), { top: 2 }),
        frame(
            8,
            "O `7` entra em `v[2]` e `top` vira `3`. Agora `top = max`: não existe posição livre, por isso o marcador `top` sumiu do desenho.",
            c(3, 5, 7),
            undefined,
            { top: 3 },
        ),

        frame(17, "A `main` tenta `push(p, 9)` com a pilha cheia.", c(3, 5, 7)),
        frame(3, "O teste `top == max` dá `3 == 3`: verdadeiro! Escrever em `v[3]` estouraria o vetor.", c(3, 5, 7)),
        frame(5, "Mostramos a mensagem de erro.", c(3, 5, 7)),
        frame(6, "`exit(1)` encerra o programa. O `9` nunca entrou na pilha.", c(3, 5, 7)),
    ],
};

/* ───────────────────────── pop com teste de pilha vazia ───────────────────────── */

export const pilhaVetorVazia: ArraySimData = {
    kind: "array",
    title: "Pilha com vetor · pilha vazia",
    orientation: "vertical",
    capacity: 3,
    code: `int pop(Pilha *p)
{
    if (p->top == 0)
    {
        printf("Erro: Pilha vazia\\n");
        exit(1);
    }
    p->top--;
    return p->v[p->top];
}

int main()
{
    Pilha *p = newPilha(3);
    push(p, 3);
    pop(p);
    pop(p);
}`,
    frames: [
        frame(14, "`newPilha(3)`: pilha vazia, `top = 0`.", c(), { top: 0 }, { max: 3, top: 0 }),
        frame(15, "`push(p, 3)`: o `3` entra em `v[0]` e `top` vira `1`.", c(3), { top: 1 }, { top: 1 }),

        frame(3, "Primeiro `pop(p)`: o teste `top == 0` dá `1 == 0`, falso. Há o que remover.", c(3), { top: 1 }),
        frame(8, "`p->top--`: `top` volta para `0`.", c(3), { top: 0 }, { top: 0 }),
        frame(9, "Devolve `p->v[0]`, que vale `3`. O valor continua no vetor, mas fora da pilha.", c(3), { top: 0 }, { retorno: 3 }),

        frame(17, "Segundo `pop(p)`, agora com a pilha vazia.", c(3), { top: 0 }),
        frame(3, "O teste `top == 0` dá `0 == 0`: verdadeiro! Sem ele, o `top--` viraria `-1` e `v[-1]` seria um acesso fora do vetor.", c(3), { top: 0 }),
        frame(5, "Mostramos a mensagem de erro.", c(3), { top: 0 }),
        frame(6, "`exit(1)` encerra o programa.", c(3), { top: 0 }),
    ],
};

/* ───────────────────────── printPilha ───────────────────────── */

export const pilhaVetorPrint: ArraySimData = {
    kind: "array",
    title: "Pilha com vetor · printPilha",
    orientation: "vertical",
    capacity: 5,
    code: `void printPilha(Pilha *p)
{
    printf("(");
    for (int i = p->top - 1; i >= 0; i--)
    {
        printf("%d", p->v[i]);
        if (i > 0)
        {
            printf("<-");
        }
    }
    printf(")");
    printf("\\n");
}`,
    frames: [
        frame(3, "Imprimimos o `(` inicial. A pilha tem `3`, `5` e `7`, com `top = 3`.", c(3, 5, 7), { top: 3 }, { top: 3, saida: "(" }),

        frame(4, "O laço começa em `i = top - 1 = 2`: a posição do elemento do topo. Vamos imprimir de cima para baixo.", c(3, 5, 7), { top: 3, i: 2 }, { i: 2 }),
        frame(6, "Imprime `p->v[2]`, o `7`.", c(3, 5, 7), { top: 3, i: 2 }, { saida: "(7" }),
        frame(9, "Como `i > 0`, imprime também a seta `<-`.", c(3, 5, 7), { top: 3, i: 2 }, { saida: "(7<-" }),

        frame(4, "`i--`: agora `i = 1`.", c(3, 5, 7), { top: 3, i: 1 }, { i: 1 }),
        frame(6, "Imprime `p->v[1]`, o `5`.", c(3, 5, 7), { top: 3, i: 1 }, { saida: "(7<-5" }),
        frame(9, "`i > 0` ainda é verdadeiro: imprime a seta.", c(3, 5, 7), { top: 3, i: 1 }, { saida: "(7<-5<-" }),

        frame(4, "`i--`: agora `i = 0`.", c(3, 5, 7), { top: 3, i: 0 }, { i: 0 }),
        frame(6, "Imprime `p->v[0]`, o `3`. Aqui `i > 0` é falso: depois do último elemento não há seta.", c(3, 5, 7), { top: 3, i: 0 }, { saida: "(7<-5<-3" }),

        frame(4, "`i--` deixa `i = -1`: a condição `i >= 0` falha e o laço termina.", c(3, 5, 7), { top: 3 }, { i: -1 }),
        frame(12, "Imprime `)` e uma quebra de linha. A pilha não foi alterada: só lemos os valores.", c(3, 5, 7), { top: 3 }, { saida: "(7<-5<-3)" }),
    ],
};

/* ───────────────────────── balanceamento de parênteses ───────────────────────── */

const balanceadoCode = `int balanceado(char *texto)
{
    int size = strlen(texto);
    Pilha *p = newPilha(size);
    for (int i = 0; i < size; i++)
    {
        if (texto[i] == '(')
        {
            push(p, 1);
        }
        if (texto[i] == ')')
        {
            if (estaVazia(p))
            {
                return 0;
            }
            pop(p);
        }
    }
    return estaVazia(p);
}`;

/** Texto "((2)+2)": balanceado. */
export const pilhaVetorBalanceado: ArraySimData = {
    kind: "array",
    title: "Pilha com vetor · parênteses balanceados",
    orientation: "vertical",
    capacity: 7,
    code: balanceadoCode,
    frames: [
        frame(4, "Texto: `((2)+2)`. Criamos uma pilha vazia com capacidade igual ao tamanho do texto (`7`).", c(), { top: 0 }, { size: 7, top: 0 }),

        frame(9, "`texto[0]` é `(`: empilhamos um `1`. O valor não importa, o que conta é a quantidade de aberturas.", c(1), { top: 1 }, { i: 0, "texto[i]": "(", top: 1 }),
        frame(9, "`texto[1]` é `(`: mais uma abertura, mais um `push`.", c(1, 1), { top: 2 }, { i: 1, "texto[i]": "(", top: 2 }),
        frame(5, "`texto[2]` é `2`: não é parêntese, nada acontece.", c(1, 1), { top: 2 }, { i: 2, "texto[i]": "2" }),
        frame(
            17,
            "`texto[3]` é `)`: a pilha não está vazia, então fazemos `pop` e `top` volta para `1`. (O valor antigo fica no vetor, mas fora da pilha.)",
            c(1, 1),
            { top: 1 },
            { i: 3, "texto[i]": ")", top: 1 },
        ),
        frame(5, "`texto[4]` é `+`: ignorado.", c(1, 1), { top: 1 }, { i: 4, "texto[i]": "+" }),
        frame(5, "`texto[5]` é `2`: ignorado.", c(1, 1), { top: 1 }, { i: 5, "texto[i]": "2" }),
        frame(17, "`texto[6]` é `)`: `pop` de novo. `top` vira `0`.", c(1, 1), { top: 0 }, { i: 6, "texto[i]": ")", top: 0 }),

        frame(20, "O texto acabou. `estaVazia(p)` é verdadeiro (`top == 0`), então devolve `1`: balanceado! ✅", c(1, 1), { top: 0 }, { retorno: 1 }),
    ],
};

/** Texto "())(": fecha sem ter aberto. */
export const pilhaVetorDesbalanceadoVazia: ArraySimData = {
    kind: "array",
    title: "Pilha com vetor · fecha sem abrir",
    orientation: "vertical",
    capacity: 4,
    code: balanceadoCode,
    frames: [
        frame(4, "Texto: `())(`. Repare: são dois `(` e dois `)`, mesmo número, mas a ordem está errada. Pilha vazia com capacidade `4`.", c(), { top: 0 }, { size: 4, top: 0 }),

        frame(9, "`texto[0]` é `(`: `push`.", c(1), { top: 1 }, { i: 0, "texto[i]": "(", top: 1 }),
        frame(17, "`texto[1]` é `)`: a pilha não está vazia, então `pop`. `top` volta para `0`.", c(1), { top: 0 }, { i: 1, "texto[i]": ")", top: 0 }),
        frame(13, "`texto[2]` é `)`. Antes do `pop`, testamos `estaVazia(p)`: `top == 0`, verdadeiro. Não há nenhum `(` esperando para ser fechado!", c(1), { top: 0 }, { i: 2, "texto[i]": ")" }),
        frame(15, "`return 0`: desbalanceado. O último `(` nem chegou a ser lido. ❌", c(1), { top: 0 }, { retorno: 0 }),
    ],
};

/** Texto "(()": sobra uma abertura. */
export const pilhaVetorDesbalanceadoSobra: ArraySimData = {
    kind: "array",
    title: "Pilha com vetor · sobra abertura",
    orientation: "vertical",
    capacity: 3,
    code: balanceadoCode,
    frames: [
        frame(4, "Texto: `(()`. Pilha vazia com capacidade `3`.", c(), { top: 0 }, { size: 3, top: 0 }),

        frame(9, "`texto[0]` é `(`: `push`.", c(1), { top: 1 }, { i: 0, "texto[i]": "(", top: 1 }),
        frame(9, "`texto[1]` é `(`: `push`.", c(1, 1), { top: 2 }, { i: 1, "texto[i]": "(", top: 2 }),
        frame(17, "`texto[2]` é `)`: `pop`. `top` volta para `1`.", c(1, 1), { top: 1 }, { i: 2, "texto[i]": ")", top: 1 }),

        frame(20, "O texto acabou, mas `top = 1`: sobrou um `(` sem fechar. `estaVazia(p)` é falso, então devolve `0`: desbalanceado. ❌", c(1, 1), { top: 1 }, { retorno: 0 }),
    ],
};

/* ───────────────────────── registro ───────────────────────── */

/** Use no registro: `export const sims = { ...(existentes), ...pilhaVetorSims }` */
export const pilhaVetorSims = {
    pilhaVetorPush,
    pilhaVetorPop,
    pilhaVetorNew,
    pilhaVetorCheia,
    pilhaVetorVazia,
    pilhaVetorPrint,
    pilhaVetorBalanceado,
    pilhaVetorDesbalanceadoVazia,
    pilhaVetorDesbalanceadoSobra,
};