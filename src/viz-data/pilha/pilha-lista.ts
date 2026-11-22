import type { Frame, NodeState, Sim } from "../types";

/**
 * Simulações de PILHA COM LISTA LIGADA (ListSim).
 *
 * - A caixa à esquerda se chama `topo` (headLabel) e aponta para o primeiro nó.
 * - O topo da pilha é sempre o primeiro nó da cadeia (coluna 0).
 * - Cores: verde = nó novo, amarelo = nó em uso por um ponteiro, vermelho = nó liberado (free).
 * - Nós que não estão na cadeia do `topo` ficam "soltos" na linha de cima.
 */

type N = Frame["nodes"][number];

/** nó: nd("a", 8, "b") = valor 8 apontando para o nó "b"; next = null aponta para NULL */
const nd = (id: string, value: number, next: string | null, state?: NodeState): N => ({
    id,
    value,
    next,
    ...(state && { state }),
});

function fr(
    line: number,
    caption: string,
    head: string | null,
    nodes: N[],
    ptrs?: Frame["ptrs"],
    vars?: Frame["vars"],
): Frame {
    return { line, caption, head, nodes, ...(ptrs && { ptrs }), ...(vars && { vars }) };
}

/** Pilha de exemplo das figuras da apostila: topo → 8 → 5 → 7 → NULL */
const S = (): N[] => [nd("a", 8, "b"), nd("b", 5, "c"), nd("c", 7, null)];

/* ───────────────────────── newNo ───────────────────────── */

export const pilhaListaNo: Sim = {
    title: "Pilha com lista · newNo",
    headLabel: "topo",
    code: `typedef struct No
{
    int valor;
    struct No *prox;
} No;

No *newNo(int valor)
{
    No *no = (No *)malloc(sizeof(No));
    no->valor = valor;
    no->prox = NULL;
    return no;
}`,
    frames: [
        fr(7, "Chamamos `newNo(7)`: queremos um nó novo guardando o valor `7`.", null, [], undefined, { valor: 7 }),
        fr(9, "`malloc` reserva memória para um nó (um `valor` e um `prox`). Por enquanto o conteúdo é lixo.", null, []),
        fr(
            11,
            "Depois de `no->valor = valor` e `no->prox = NULL`, o nó guarda o `7` e o `prox` aponta para `NULL`, sem nenhum vizinho.",
            null,
            [nd("a", 7, null, "novo")],
            { no: "a" },
        ),
        fr(12, "`return no`: devolvemos o endereço do nó. Ele ainda está solto, não faz parte de nenhuma pilha.", null, [nd("a", 7, null)], { no: "a" }),
    ],
};

/* ───────────────────────── newPilha ───────────────────────── */

export const pilhaListaNew: Sim = {
    title: "Pilha com lista · newPilha",
    headLabel: "topo",
    code: `typedef struct Pilha
{
    No *topo;
} Pilha;

Pilha *newPilha()
{
    Pilha *p = (Pilha *)malloc(sizeof(Pilha));
    p->topo = NULL;
    return p;
}`,
    frames: [
        fr(6, "A pilha é uma struct com um único campo: o `topo`, um ponteiro para o primeiro nó. Repare que não existe `max`.", null, []),
        fr(9, "`p->topo = NULL`: a pilha está vazia. O `topo` não aponta para nenhum nó (veja o `NULL` ao lado da caixa).", null, []),
        fr(10, "`return p`: devolvemos a pilha vazia, pronta para receber `push`.", null, []),
    ],
};

/* ───────────────────────── push ───────────────────────── */

export const pilhaListaPush: Sim = {
    title: "Pilha com lista · push",
    headLabel: "topo",
    code: `void push(Pilha *p, int x)
{
    No *no = newNo(x);   // (a)
    no->prox = p->topo;  // (b)
    p->topo = no;        // (c)
}`,
    frames: [
        fr(1, "A pilha tem `8`, `5` e `7` (o topo é o `8`). Vamos chamar `push(p, 2)`.", "a", S(), undefined, { x: 2 }),
        fr(3, "(a) `newNo(2)` cria um nó solto, com `prox = NULL`. A variável `no` aponta para ele.", "a", [...S(), nd("d", 2, null, "novo")], { no: "d" }),
        fr(4, "(b) `no->prox = p->topo`: o novo nó passa a apontar para o antigo topo (o `8`). Assim ele não perde o resto da pilha.", "a", [...S(), nd("d", 2, "a", "novo")], { no: "d" }),
        fr(5, "(c) `p->topo = no`: agora o topo é o novo nó. A pilha ficou `2`, `8`, `5`, `7`.", "d", [nd("d", 2, "a", "novo"), ...S()], { no: "d" }),
        fr(6, "A função termina: a variável `no` deixa de existir, mas o nó continua na pilha, como novo topo.", "d", [nd("d", 2, "a"), ...S()]),
    ],
};

/* ───────────────────────── pop ───────────────────────── */

export const pilhaListaPop: Sim = {
    title: "Pilha com lista · pop",
    headLabel: "topo",
    code: `int pop(Pilha *p)
{
    int valor;
    if (p->topo == NULL)
    {
        printf("Pilha Vazia\\n");
        exit(1);
    }
    valor = p->topo->valor;
    No *no = p->topo;
    p->topo = p->topo->prox;
    free(no);
    return valor;
}`,
    frames: [
        fr(1, "A pilha tem `8`, `5` e `7`. Vamos chamar `pop(p)`.", "a", S()),
        fr(4, "Primeiro o teste: `p->topo == NULL`? O topo aponta para o nó `8`, então a pilha não está vazia e podemos seguir.", "a", S()),
        fr(
            9,
            "`valor = p->topo->valor`: guardamos o `8` em uma variável, porque daqui a pouco o nó vai ser liberado.",
            "a",
            [nd("a", 8, "b", "visitando"), nd("b", 5, "c"), nd("c", 7, null)],
            undefined,
            { valor: 8 },
        ),
        fr(10, "`No *no = p->topo`: `no` aponta para o nó do topo. Vamos precisar dele para dar o `free`.", "a", [nd("a", 8, "b", "visitando"), nd("b", 5, "c"), nd("c", 7, null)], { no: "a" }),
        fr(
            11,
            "`p->topo = p->topo->prox`: o topo avança para o nó seguinte (`5`). O nó `8` saiu da pilha, mas continua na memória, apontado por `no`.",
            "b",
            [nd("a", 8, "b", "visitando"), nd("b", 5, "c"), nd("c", 7, null)],
            { no: "a" },
        ),
        fr(12, "`free(no)`: devolvemos a memória do nó `8` ao sistema. Ele é apagado de vez.", "b", [nd("a", 8, "b", "removido"), nd("b", 5, "c"), nd("c", 7, null)], { no: "a" }),
        fr(13, "`return valor`: devolvemos o `8`. A pilha agora tem `5` e `7`.", "b", [nd("b", 5, "c"), nd("c", 7, null)], undefined, { retorno: 8 }),
    ],
};

/* ───────────────────────── pop em pilha vazia ───────────────────────── */

export const pilhaListaPopVazia: Sim = {
    title: "Pilha com lista · pop em pilha vazia",
    headLabel: "topo",
    code: `int pop(Pilha *p)
{
    int valor;
    if (p->topo == NULL)
    {
        printf("Pilha Vazia\\n");
        exit(1);
    }
    valor = p->topo->valor;
    No *no = p->topo;
    p->topo = p->topo->prox;
    free(no);
    return valor;
}`,
    frames: [
        fr(1, "A pilha está vazia: o `topo` aponta para `NULL`. Mesmo assim, alguém chama `pop(p)`.", null, []),
        fr(4, "O teste `p->topo == NULL` é verdadeiro. Ainda bem que ele existe!", null, []),
        fr(6, "Mostramos a mensagem de erro.", null, []),
        fr(7, "`exit(1)` encerra o programa. Sem esse teste, a linha `p->topo->valor` tentaria ler o `valor` de um nó que não existe: erro grave de memória.", null, []),
    ],
};

/* ───────────────────────── printPilha ───────────────────────── */

export const pilhaListaPrint: Sim = {
    title: "Pilha com lista · printPilha",
    headLabel: "topo",
    code: `void printPilha(Pilha *p)
{
    printf("(");
    No *aux = p->topo;
    while (aux != NULL)
    {
        printf("%d", aux->valor);
        aux = aux->prox;
        if (aux != NULL)
        {
            printf("<-");
        }
    }
    printf(")");
    printf(" [%d]\\n", size(p));
}`,
    frames: [
        fr(3, "Imprimimos o `(` inicial. A pilha tem `8` e `5`.", "a", [nd("a", 8, "b"), nd("b", 5, null)], undefined, { saida: "(" }),
        fr(4, "`No *aux = p->topo`: `aux` começa no primeiro nó, o topo.", "a", [nd("a", 8, "b", "visitando"), nd("b", 5, null)], { aux: "a" }),
        fr(7, "`aux != NULL`, então imprimimos `aux->valor`: o `8`.", "a", [nd("a", 8, "b", "visitando"), nd("b", 5, null)], { aux: "a" }, { saida: "(8" }),
        fr(8, "`aux = aux->prox`: `aux` anda para o próximo nó (o `5`).", "a", [nd("a", 8, "b"), nd("b", 5, null, "visitando")], { aux: "b" }),
        fr(11, "`aux` ainda não é `NULL`, então ainda há elementos a imprimir: mostramos a seta `<-`.", "a", [nd("a", 8, "b"), nd("b", 5, null, "visitando")], { aux: "b" }, { saida: "(8<-" }),
        fr(7, "De volta ao laço: imprimimos `aux->valor`, o `5`.", "a", [nd("a", 8, "b"), nd("b", 5, null, "visitando")], { aux: "b" }, { saida: "(8<-5" }),
        fr(8, "`aux = aux->prox`: o `5` aponta para `NULL`, então `aux` vira `NULL`.", "a", [nd("a", 8, "b"), nd("b", 5, null)], { aux: null }),
        fr(9, "Agora `aux != NULL` é falso: não há seta depois do último elemento. E o `while` termina.", "a", [nd("a", 8, "b"), nd("b", 5, null)], { aux: null }),
        fr(14, "Imprimimos o `)` final.", "a", [nd("a", 8, "b"), nd("b", 5, null)], undefined, { saida: "(8<-5)" }),
        fr(15, "Por fim, mostramos o tamanho da pilha, `size(p)`: `2`. A pilha não foi alterada, apenas lida.", "a", [nd("a", 8, "b"), nd("b", 5, null)], undefined, { saida: "(8<-5) [2]" }),
    ],
};

/* ───────────────────────── size (iterativo) ───────────────────────── */

export const pilhaListaSize: Sim = {
    title: "Pilha com lista · size",
    headLabel: "topo",
    code: `int size(Pilha *p)
{
    int size = 0;
    No *aux = p->topo;
    while (aux != NULL)
    {
        aux = aux->prox;
        size++;
    }
    return size;
}`,
    frames: [
        fr(3, "Começamos contando `0` elementos. A pilha tem `8`, `5` e `7`.", "a", S(), undefined, { size: 0 }),
        fr(4, "`aux` começa no topo.", "a", [nd("a", 8, "b", "visitando"), nd("b", 5, "c"), nd("c", 7, null)], { aux: "a" }),
        fr(7, "`aux != NULL`: `aux` anda para o próximo nó.", "a", [nd("a", 8, "b"), nd("b", 5, "c", "visitando"), nd("c", 7, null)], { aux: "b" }),
        fr(8, "`size++`: já passamos por 1 nó.", "a", [nd("a", 8, "b"), nd("b", 5, "c", "visitando"), nd("c", 7, null)], { aux: "b" }, { size: 1 }),
        fr(7, "`aux` anda de novo.", "a", [nd("a", 8, "b"), nd("b", 5, "c"), nd("c", 7, null, "visitando")], { aux: "c" }),
        fr(8, "`size++`: agora `size = 2`.", "a", [nd("a", 8, "b"), nd("b", 5, "c"), nd("c", 7, null, "visitando")], { aux: "c" }, { size: 2 }),
        fr(7, "`aux = aux->prox`: o `7` aponta para `NULL`, então `aux` vira `NULL`.", "a", S(), { aux: null }),
        fr(8, "`size++`: `size = 3`.", "a", S(), { aux: null }, { size: 3 }),
        fr(5, "`aux != NULL` é falso: o laço termina. Tivemos que percorrer a pilha inteira para contar.", "a", S(), { aux: null }),
        fr(10, "`return size`: devolve `3`.", "a", S(), undefined, { retorno: 3 }),
    ],
};

/* ───────────────────────── size recursivo ───────────────────────── */

export const pilhaListaSizeRec: Sim = {
    title: "Pilha com lista · size recursivo",
    headLabel: "topo",
    code: `int sizeRec(No *no)
{
    if (no == NULL)
    {
        return 0;
    }
    return 1 + sizeRec(no->prox);
}

int size3(Pilha *p)
{
    return sizeRec(p->topo);
}`,
    frames: [
        fr(12, "`size3` chama `sizeRec(p->topo)`: 1ª chamada, com `no` no nó `8`.", "a", [nd("a", 8, "b", "visitando"), nd("b", 5, null)], { no: "a" }),
        fr(3, "1ª chamada: `no == NULL`? Não, `no` aponta para o `8`.", "a", [nd("a", 8, "b", "visitando"), nd("b", 5, null)], { no: "a" }),
        fr(7, "Então devolve `1 + sizeRec(no->prox)`. A 2ª chamada começa no nó `5`.", "a", [nd("a", 8, "b"), nd("b", 5, null, "visitando")], { no: "b" }, { conta: "1 + sizeRec(...)" }),
        fr(3, "2ª chamada: `no == NULL`? Não, `no` aponta para o `5`.", "a", [nd("a", 8, "b"), nd("b", 5, null, "visitando")], { no: "b" }),
        fr(7, "Devolve `1 + sizeRec(no->prox)`. A 3ª chamada começa em `NULL`.", "a", [nd("a", 8, "b"), nd("b", 5, null)], { no: null }, { conta: "1 + 1 + sizeRec(...)" }),
        fr(5, "3ª chamada: `no == NULL`. Chegamos ao fim: devolve `0`. Agora as chamadas voltam, resolvendo as somas.", "a", [nd("a", 8, "b"), nd("b", 5, null)], { no: null }, { conta: "1 + 1 + 0" }),
        fr(7, "De volta à 2ª chamada: `1 + 0 = 1`.", "a", [nd("a", 8, "b"), nd("b", 5, null, "visitando")], { no: "b" }, { conta: "1 + 1" }),
        fr(7, "De volta à 1ª chamada: `1 + 1 = 2`.", "a", [nd("a", 8, "b", "visitando"), nd("b", 5, null)], { no: "a" }, { conta: "2" }),
        fr(12, "`size3` devolve `2`.", "a", [nd("a", 8, "b"), nd("b", 5, null)], undefined, { retorno: 2 }),
    ],
};

/* ───────────────────────── balanceado (com lista) ───────────────────────── */

export const pilhaListaBalanceado: Sim = {
    title: "Pilha com lista · parênteses balanceados",
    headLabel: "topo",
    code: `int balanceado(char *texto)
{
    int size = strlen(texto);
    Pilha *p = newPilha();
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
}`,
    frames: [
        fr(4, "Texto: `((2)+2)`. `newPilha()` cria uma pilha vazia. Repare: não precisamos informar o tamanho do texto.", null, [], undefined, { size: 7 }),
        fr(9, "`texto[0]` é `(`: `push` cria um nó novo com o valor `1`.", "a", [nd("a", 1, null, "novo")], undefined, { i: 0, "texto[i]": "(" }),
        fr(9, "`texto[1]` é `(`: outro `push`. O novo nó vira o topo.", "b", [nd("b", 1, "a", "novo"), nd("a", 1, null)], undefined, { i: 1, "texto[i]": "(" }),
        fr(5, "`texto[2]` é `2`: não é parêntese, nada acontece.", "b", [nd("b", 1, "a"), nd("a", 1, null)], undefined, { i: 2, "texto[i]": "2" }),
        fr(17, "`texto[3]` é `)`: a pilha não está vazia, então `pop` remove o nó do topo e libera sua memória.", "a", [nd("a", 1, null)], undefined, { i: 3, "texto[i]": ")" }),
        fr(5, "`texto[4]` é `+`: ignorado.", "a", [nd("a", 1, null)], undefined, { i: 4, "texto[i]": "+" }),
        fr(5, "`texto[5]` é `2`: ignorado.", "a", [nd("a", 1, null)], undefined, { i: 5, "texto[i]": "2" }),
        fr(17, "`texto[6]` é `)`: `pop` remove o último nó. A pilha fica vazia.", null, [], undefined, { i: 6, "texto[i]": ")" }),
        fr(20, "O texto acabou. `estaVazia(p)` é verdadeiro (`topo == NULL`), então devolve `1`: balanceado! ✅", null, [], undefined, { retorno: 1 }),
    ],
};

/* ───────────────────────── push por referência (No **p) ───────────────────────── */

export const pilhaListaPushRef: Sim = {
    title: "Pilha com lista · push por referência",
    headLabel: "p",
    code: `void push(No **p, int x)
{
    No *no = newNo(x);
    no->prox = (*p);
    (*p) = no;
}

int main()
{
    No *p = NULL;
    push(&p, 1);
    push(&p, 2);
}`,
    frames: [
        fr(10, "Sem a struct `Pilha`, a pilha é apenas um ponteiro para o primeiro nó. `No *p = NULL` é a pilha vazia.", null, []),
        fr(11, "`push(&p, 1)`: passamos o endereço de `p`, para que a função consiga alterar o próprio `p` da `main`.", null, [], undefined, { x: 1 }),
        fr(3, "`newNo(1)` cria o nó solto.", null, [nd("a", 1, null, "novo")], { no: "a" }),
        fr(4, "`no->prox = (*p)`: `(*p)` é o `p` da `main`, que vale `NULL`. O nó continua apontando para `NULL`.", null, [nd("a", 1, null, "novo")], { no: "a" }),
        fr(5, "`(*p) = no`: o `p` da `main` passa a apontar para o novo nó.", "a", [nd("a", 1, null, "novo")], { no: "a" }),
        fr(12, "`push(&p, 2)`.", "a", [nd("a", 1, null)], undefined, { x: 2 }),
        fr(3, "`newNo(2)` cria outro nó solto.", "a", [nd("a", 1, null), nd("b", 2, null, "novo")], { no: "b" }),
        fr(4, "`no->prox = (*p)`: o novo nó aponta para o nó que `p` apontava (o `1`).", "a", [nd("a", 1, null), nd("b", 2, "a", "novo")], { no: "b" }),
        fr(5, "`(*p) = no`: o `p` da `main` passa a apontar para o novo nó. A pilha é `2`, `1`.", "b", [nd("b", 2, "a", "novo"), nd("a", 1, null)], { no: "b" }),
        fr(13, "Fim: a pilha tem `2` e `1`, e o `p` da `main` aponta para o topo.", "b", [nd("b", 2, "a"), nd("a", 1, null)]),
    ],
};

/* ───────────────────────── registro ───────────────────────── */

/** Use no registro: `export const sims = { ...(existentes), ...pilhaListaSims }` */
export const pilhaListaSims = {
    pilhaListaNo,
    pilhaListaNew,
    pilhaListaPush,
    pilhaListaPop,
    pilhaListaPopVazia,
    pilhaListaPrint,
    pilhaListaSize,
    pilhaListaSizeRec,
    pilhaListaBalanceado,
    pilhaListaPushRef,
};