import type { Frame, NodeState, Sim } from "../types";

/**
 * Simulações de FILA COM LISTA LIGADA (ListSim).
 *
 * - A caixa à esquerda se chama `ini` (headLabel) e aponta para o primeiro nó da fila.
 * - O ponteiro `fim` aparece como rótulo (ptrs) embaixo do último nó.
 * - Elementos entram no FIM e saem do INÍCIO.
 * - Cores: verde = nó novo, amarelo = nó em uso por um ponteiro, vermelho = nó liberado (free).
 * - Nó com `top(col)` fica fixo na linha de cima, na coluna indicada (nó solto, ainda não ligado).
 */

type N = Frame["nodes"][number];

/** posição fixa na linha de cima (nó solto) */
const top = (col: number) => ({ col, row: "top" as const });

/** nó: nd("a", 3, "b") = valor 3 apontando para "b"; next = null aponta para NULL */
const nd = (
    id: string,
    value: number,
    next: string | null,
    state?: NodeState,
    pos?: { col: number; row?: "top" },
): N => ({
    id,
    value,
    next,
    ...(state && { state }),
    ...(pos && pos),
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

/** Fila de exemplo (main da apostila): ini → 3 → 7 → 9 → NULL */
const Q = (): N[] => [nd("a", 3, "b"), nd("b", 7, "c"), nd("c", 9, null)];

/* ───────────────────────── newFila ───────────────────────── */

export const filaListaNew: Sim = {
    title: "Fila com lista · newFila",
    headLabel: "ini",
    code: `typedef struct Fila
{
    No *ini;
    No *fim;
} Fila;

Fila *newFila()
{
    Fila *fila = (Fila *)malloc(sizeof(Fila));
    fila->ini = NULL;
    fila->fim = NULL;
    return fila;
}`,
    frames: [
        fr(
            7,
            "A fila é uma struct com dois ponteiros: `ini`, que aponta para o primeiro nó (de onde os elementos saem), e `fim`, que aponta para o último (onde os elementos entram).",
            null,
            [],
        ),
        fr(10, "`fila->ini = NULL`: ainda não existe um primeiro nó.", null, []),
        fr(11, "`fila->fim = NULL`: também não existe um último nó. A fila nasce vazia, com `ini` e `fim` valendo `NULL`.", null, [], { fim: null }),
        fr(12, "`return fila`: devolvemos a fila vazia, pronta para receber `add`.", null, [], { fim: null }),
    ],
};

/* ───────────────────────── add em fila vazia ───────────────────────── */

const addCode = `void add(Fila *f, int x)
{
    No *no = newNo(x);
    if (estaVazia(f))
    {
        f->ini = no;
        f->fim = no;
    }
    else
    {
        f->fim->prox = no;
        f->fim = no;
    }
}`;

export const filaListaAddVazia: Sim = {
    title: "Fila com lista · add em fila vazia",
    headLabel: "ini",
    code: addCode,
    frames: [
        fr(1, "A fila está vazia: `ini` e `fim` valem `NULL`. Vamos chamar `add(f, 5)`.", null, [], { fim: null }, { x: 5 }),
        fr(3, "`newNo(5)` cria um nó solto, com `prox = NULL`. A variável `no` aponta para ele.", null, [nd("a", 5, null, "novo", top(0))], { fim: null, no: "a" }),
        fr(4, "`estaVazia(f)` é verdadeiro (`ini == NULL`). Este é o caso especial: não existe último nó para ligar ao novo.", null, [nd("a", 5, null, "novo", top(0))], { fim: null, no: "a" }),
        fr(6, "`f->ini = no`: o `ini` passa a apontar para o novo nó.", "a", [nd("a", 5, null, "novo")], { fim: null, no: "a" }),
        fr(7, "`f->fim = no`: o `fim` também aponta para ele. Com um único elemento, `ini` e `fim` apontam para o mesmo nó.", "a", [nd("a", 5, null, "novo")], { fim: "a", no: "a" }),
        fr(14, "A função termina: a variável `no` some, mas o nó continua na fila.", "a", [nd("a", 5, null)], { fim: "a" }),
    ],
};

/* ───────────────────────── add em fila com elementos ───────────────────────── */

export const filaListaAdd: Sim = {
    title: "Fila com lista · add",
    headLabel: "ini",
    code: addCode,
    frames: [
        fr(1, "A fila tem `3`, `7` e `9`: o `ini` aponta para o `3` e o `fim` para o `9`. Vamos chamar `add(f, 10)`.", "a", Q(), { fim: "c" }, { x: 10 }),
        fr(3, "(a) `newNo(10)` cria um nó solto, com `prox = NULL`.", "a", [...Q(), nd("d", 10, null, "novo", top(3))], { fim: "c", no: "d" }),
        fr(4, "`estaVazia(f)` é falso (o `ini` aponta para o `3`), então seguimos pelo `else`.", "a", [...Q(), nd("d", 10, null, "novo", top(3))], { fim: "c", no: "d" }),
        fr(
            11,
            "(b) `f->fim->prox = no`: o último nó (o `9`) passa a apontar para o novo nó.",
            "a",
            [nd("a", 3, "b"), nd("b", 7, "c"), nd("c", 9, "d"), nd("d", 10, null, "novo", top(3))],
            { fim: "c", no: "d" },
        ),
        fr(
            12,
            "(c) `f->fim = no`: o `fim` passa a apontar para o novo nó, que agora é o último da fila.",
            "a",
            [nd("a", 3, "b"), nd("b", 7, "c"), nd("c", 9, "d"), nd("d", 10, null, "novo")],
            { fim: "d", no: "d" },
        ),
        fr(
            14,
            "A função termina. O `10` entrou no final da fila, e quem já estava esperando continua na frente.",
            "a",
            [nd("a", 3, "b"), nd("b", 7, "c"), nd("c", 9, "d"), nd("d", 10, null)],
            { fim: "d" },
        ),
    ],
};

/* ───────────────────────── remover ───────────────────────── */

const removerCode = `int remover(Fila *fila)
{
    int valor;
    if (estaVazia(fila))
    {
        printf("Fila Vazia\\n");
        exit(1);
    }
    valor = fila->ini->valor;
    No *no = fila->ini;
    if (fila->ini == fila->fim)
    {
        fila->ini = NULL;
        fila->fim = NULL;
    }
    else
    {
        fila->ini = fila->ini->prox;
    }
    free(no);
    return valor;
}`;

/** fila com 2 ou mais elementos */
export const filaListaRemover: Sim = {
    title: "Fila com lista · remover",
    headLabel: "ini",
    code: removerCode,
    frames: [
        fr(1, "A fila tem `3`, `7` e `9`. Vamos chamar `remover(fila)`: quem sai é o primeiro que entrou.", "a", Q(), { fim: "c" }),
        fr(4, "Primeiro o teste: a fila está vazia? Não, o `ini` aponta para o `3`. Podemos seguir.", "a", Q(), { fim: "c" }),
        fr(9, "`valor = fila->ini->valor`: guardamos o `3` em uma variável, porque o nó vai ser liberado.", "a", [nd("a", 3, "b", "visitando"), nd("b", 7, "c"), nd("c", 9, null)], { fim: "c" }, { valor: 3 }),
        fr(10, "`No *no = fila->ini`: `no` aponta para o nó que vai sair, para podermos liberá-lo depois.", "a", [nd("a", 3, "b", "visitando"), nd("b", 7, "c"), nd("c", 9, null)], { fim: "c", no: "a" }),
        fr(11, "`fila->ini == fila->fim`? O `ini` aponta para o `3` e o `fim` para o `9`: são diferentes, então a fila tem 2 ou mais elementos. Vamos para o `else`.", "a", [nd("a", 3, "b", "visitando"), nd("b", 7, "c"), nd("c", 9, null)], { fim: "c", no: "a" }),
        fr(18, "`fila->ini = fila->ini->prox`: o `ini` avança para o próximo nó (o `7`). O `fim` não muda.", "b", [nd("a", 3, "b", "visitando"), nd("b", 7, "c"), nd("c", 9, null)], { fim: "c", no: "a" }),
        fr(20, "`free(no)`: devolvemos a memória do nó `3`. Ele sai de vez da fila.", "b", [nd("a", 3, "b", "removido"), nd("b", 7, "c"), nd("c", 9, null)], { fim: "c", no: "a" }),
        fr(21, "`return valor`: devolvemos o `3`. A fila agora tem `7` e `9`.", "b", [nd("b", 7, "c"), nd("c", 9, null)], { fim: "c" }, { retorno: 3 }),
    ],
};

/** fila com exatamente 1 elemento */
export const filaListaRemoverUnico: Sim = {
    title: "Fila com lista · remover o único elemento",
    headLabel: "ini",
    code: removerCode,
    frames: [
        fr(1, "A fila tem um único elemento, o `5`: `ini` e `fim` apontam para o mesmo nó. Vamos chamar `remover(fila)`.", "a", [nd("a", 5, null)], { fim: "a" }),
        fr(4, "A fila não está vazia, então podemos seguir.", "a", [nd("a", 5, null)], { fim: "a" }),
        fr(9, "`valor = fila->ini->valor`: guardamos o `5`.", "a", [nd("a", 5, null, "visitando")], { fim: "a" }, { valor: 5 }),
        fr(10, "`No *no = fila->ini`: `no` aponta para o nó que vai sair.", "a", [nd("a", 5, null, "visitando")], { fim: "a", no: "a" }),
        fr(11, "`fila->ini == fila->fim`: verdadeiro! Só há um nó, então depois de removê-lo a fila ficará vazia.", "a", [nd("a", 5, null, "visitando")], { fim: "a", no: "a" }),
        fr(13, "`fila->ini = NULL`: o `ini` deixa de apontar para o nó.", null, [nd("a", 5, null, "visitando")], { fim: "a", no: "a" }),
        fr(14, "`fila->fim = NULL`: o `fim` também precisa ser zerado! Se ele continuasse apontando para o nó, depois do `free` ficaria apontando para uma memória que não existe mais.", null, [nd("a", 5, null, "visitando")], { fim: null, no: "a" }),
        fr(20, "`free(no)`: o nó é liberado.", null, [nd("a", 5, null, "removido")], { fim: null, no: "a" }),
        fr(21, "`return valor`: devolvemos o `5`. A fila voltou a ficar vazia, com `ini` e `fim` valendo `NULL`.", null, [], { fim: null }, { retorno: 5 }),
    ],
};

/** fila vazia */
export const filaListaRemoverVazia: Sim = {
    title: "Fila com lista · remover em fila vazia",
    headLabel: "ini",
    code: removerCode,
    frames: [
        fr(1, "A fila está vazia: `ini` e `fim` valem `NULL`. Mesmo assim, alguém chama `remover(fila)`.", null, [], { fim: null }),
        fr(4, "O teste `estaVazia(fila)` é verdadeiro (`ini == NULL`). Ainda bem que ele existe!", null, [], { fim: null }),
        fr(6, "Mostramos a mensagem de erro.", null, [], { fim: null }),
        fr(7, "`exit(1)` encerra o programa. Sem esse teste, `fila->ini->valor` tentaria ler o valor de um nó que não existe: erro grave de memória.", null, [], { fim: null }),
    ],
};

/* ───────────────────────── printFila ───────────────────────── */

export const filaListaPrint: Sim = {
    title: "Fila com lista · printFila",
    headLabel: "ini",
    code: `void printFila(Fila *fila)
{
    printf("[");
    No *aux = fila->ini;
    while (aux != NULL)
    {
        printf("%d", aux->valor);
        aux = aux->prox;
        if (aux != NULL)
        {
            printf(",");
        }
    }
    printf("]");
    printf("(%d)\\n", size(fila));
}`,
    frames: [
        fr(3, "Imprimimos o `[` inicial. A fila tem `3`, `7` e `9`.", "a", Q(), { fim: "c" }, { saida: "[" }),
        fr(4, "`No *aux = fila->ini`: `aux` começa no primeiro nó da fila.", "a", [nd("a", 3, "b", "visitando"), nd("b", 7, "c"), nd("c", 9, null)], { fim: "c", aux: "a" }),
        fr(7, "`aux != NULL`: imprimimos `aux->valor`, o `3`.", "a", [nd("a", 3, "b", "visitando"), nd("b", 7, "c"), nd("c", 9, null)], { fim: "c", aux: "a" }, { saida: "[3" }),
        fr(8, "`aux = aux->prox`: `aux` anda para o próximo nó.", "a", [nd("a", 3, "b"), nd("b", 7, "c", "visitando"), nd("c", 9, null)], { fim: "c", aux: "b" }),
        fr(11, "`aux` não é `NULL`, então ainda há elementos: imprimimos a vírgula.", "a", [nd("a", 3, "b"), nd("b", 7, "c", "visitando"), nd("c", 9, null)], { fim: "c", aux: "b" }, { saida: "[3," }),
        fr(7, "Imprimimos `aux->valor`, o `7`.", "a", [nd("a", 3, "b"), nd("b", 7, "c", "visitando"), nd("c", 9, null)], { fim: "c", aux: "b" }, { saida: "[3,7" }),
        fr(8, "`aux` anda para o último nó.", "a", [nd("a", 3, "b"), nd("b", 7, "c"), nd("c", 9, null, "visitando")], { fim: "c", aux: "c" }),
        fr(11, "`aux` ainda não é `NULL`: imprimimos a vírgula.", "a", [nd("a", 3, "b"), nd("b", 7, "c"), nd("c", 9, null, "visitando")], { fim: "c", aux: "c" }, { saida: "[3,7," }),
        fr(7, "Imprimimos `aux->valor`, o `9`.", "a", [nd("a", 3, "b"), nd("b", 7, "c"), nd("c", 9, null, "visitando")], { fim: "c", aux: "c" }, { saida: "[3,7,9" }),
        fr(8, "`aux = aux->prox`: o `9` aponta para `NULL`, então `aux` vira `NULL`.", "a", Q(), { fim: "c", aux: null }),
        fr(9, "`aux != NULL` é falso: não há vírgula depois do último elemento, e o `while` termina.", "a", Q(), { fim: "c", aux: null }),
        fr(14, "Imprimimos o `]` final.", "a", Q(), { fim: "c" }, { saida: "[3,7,9]" }),
        fr(15, "Por fim, mostramos o tamanho da fila, `size(fila)`: `3`. A fila não foi alterada, só lida.", "a", Q(), { fim: "c" }, { saida: "[3,7,9](3)" }),
    ],
};

/* ───────────────────────── produtor e consumidor ───────────────────────── */

export const filaListaProdutorConsumidor: Sim = {
    title: "Fila com lista · produtor e consumidor",
    headLabel: "ini",
    code: `void produtor(Fila *f)
{
    int tarefa = rand() % 100;
    add(f, tarefa);
    printf("Add tarefa %d\\n", tarefa);
}

void consumidor(Fila *f)
{
    if (!estaVazia(f))
    {
        int tarefa = remover(f);
        printf("Processando tarefa %d\\n", tarefa);
    }
}`,
    frames: [
        fr(1, "Uma fila de tarefas, vazia. De um lado, o produtor coloca tarefas no final; do outro, o consumidor retira do início.", null, [], { fim: null }),
        fr(4, "O `produtor` sorteia a tarefa `42` e a coloca no final da fila com `add`.", "a", [nd("a", 42, null, "novo")], { fim: "a" }, { tarefa: 42, saida: "Add tarefa 42" }),
        fr(4, "O `produtor` entra de novo: a tarefa `17` vai para o final, atrás do `42`.", "a", [nd("a", 42, "b"), nd("b", 17, null, "novo")], { fim: "b" }, { tarefa: 17, saida: "Add tarefa 17" }),
        fr(12, "O `consumidor` vê que a fila não está vazia e remove o primeiro: a tarefa `42`. Foi a primeira a entrar e é a primeira a sair.", "b", [nd("b", 17, null)], { fim: "b" }, { tarefa: 42, saida: "Processando tarefa 42" }),
        fr(4, "O `produtor` coloca a tarefa `88` no final da fila.", "b", [nd("b", 17, "c"), nd("c", 88, null, "novo")], { fim: "c" }, { tarefa: 88, saida: "Add tarefa 88" }),
        fr(12, "O `consumidor` processa a tarefa `17`, a próxima da fila.", "c", [nd("c", 88, null)], { fim: "c" }, { tarefa: 17, saida: "Processando tarefa 17" }),
        fr(12, "O `consumidor` processa a tarefa `88`. A fila fica vazia.", null, [], { fim: null }, { tarefa: 88, saida: "Processando tarefa 88" }),
        fr(10, "O `consumidor` é chamado com a fila vazia: `!estaVazia(f)` é falso, então ele simplesmente não faz nada. Sem o teste, o `remover` encerraria o programa com erro.", null, [], { fim: null }, { saida: "(nada a processar)" }),
    ],
};

/* ───────────────────────── fila com prioridade ───────────────────────── */

/**
 * Duas filas desenhadas juntas:
 *  - linha de baixo (principal): fila prioritária, apontada pela caixa `prior`;
 *  - linha de cima: fila normal, apontada pelo rótulo `normal`.
 */
const normais = (ids: [string, number][]): N[] =>
    ids.map(([id, v], i) => nd(id, v, i < ids.length - 1 ? ids[i + 1][0] : null, undefined, top(i)));

const N3 = () => normais([["n1", 3], ["n2", 4], ["n3", 6]]);

export const filaListaPrioridade: Sim = {
    title: "Fila com lista · fila com prioridade",
    headLabel: "prior",
    code: `int removerPri(FilaPrioridade *f)
{
    if (!estaVazia(f->prioritario))
    {
        return remover(f->prioritario);
    }
    else
    {
        return remover(f->normal);
    }
}`,
    frames: [
        fr(
            1,
            "Duas filas: a prioritária (embaixo, apontada por `prior`) tem `7` e `10`; a normal (em cima) tem `3`, `4` e `6`. Vamos chamar `removerPri` várias vezes.",
            "p1",
            [nd("p1", 7, "p2"), nd("p2", 10, null), ...N3()],
            { normal: "n1" },
        ),
        fr(3, "A fila prioritária está vazia? Não. Então o elemento sai dela.", "p1", [nd("p1", 7, "p2"), nd("p2", 10, null), ...N3()], { normal: "n1" }),
        fr(5, "`remover(f->prioritario)`: sai o `7`, mesmo que o `3` tenha chegado antes na fila normal.", "p2", [nd("p2", 10, null), ...N3()], { normal: "n1" }, { saida: "7" }),
        fr(3, "De novo: a prioritária ainda tem o `10`, então não está vazia.", "p2", [nd("p2", 10, null), ...N3()], { normal: "n1" }),
        fr(5, "Sai o `10`. A fila prioritária fica vazia.", null, N3(), { normal: "n1" }, { saida: "7 10" }),
        fr(3, "Agora `estaVazia(f->prioritario)` é verdadeiro: o `if` falha e vamos para o `else`.", null, N3(), { normal: "n1" }),
        fr(9, "`remover(f->normal)`: sai o `3`, o primeiro da fila normal.", null, normais([["n2", 4], ["n3", 6]]), { normal: "n2" }, { saida: "7 10 3" }),
        fr(9, "Sai o `4`.", null, normais([["n3", 6]]), { normal: "n3" }, { saida: "7 10 3 4" }),
        fr(9, "Sai o `6`. As duas filas ficaram vazias. A ordem de saída foi `7 10 3 4 6`: primeiro os prioritários, depois os normais, cada grupo respeitando a regra FIFO.", null, [], undefined, { saida: "7 10 3 4 6" }),
    ],
};

/* ───────────────────────── registro ───────────────────────── */

/** Use no registro: `export const sims = { ...(existentes), ...filaListaSims }` */
export const filaListaSims = {
    filaListaNew,
    filaListaAddVazia,
    filaListaAdd,
    filaListaRemover,
    filaListaRemoverUnico,
    filaListaRemoverVazia,
    filaListaPrint,
    filaListaProdutorConsumidor,
    filaListaPrioridade,
};