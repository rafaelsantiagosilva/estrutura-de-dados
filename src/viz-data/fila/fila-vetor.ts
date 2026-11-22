import type { ArrayFrame, ArraySimData, NodeState } from "../types";

/**
 * Simulações de FILA COM VETOR (ArraySim, orientação horizontal).
 *
 * - `ini`: índice do primeiro elemento da fila (de onde saem os elementos).
 * - `fim`: índice da primeira posição LIVRE (onde entra o próximo elemento).
 * - Como na apostila, posição livre guarda 0; aqui ela é desenhada como célula vazia (tracejada).
 * - Cores: verde = elemento recém-inserido, amarelo = elemento sendo lido por `remover`.
 * - Um marcador pode apontar para o índice `capacity` (logo depois da última célula): é o `fim`
 *   que saiu do vetor, usado para mostrar o problema da versão sem circularidade.
 */

type Cells = ArrayFrame["cells"];
type Ptrs = NonNullable<ArrayFrame["ptrs"]>;
type Vars = NonNullable<ArrayFrame["vars"]>;

/** número = célula normal; [valor, estado] = célula colorida; null = vazia */
type Item = number | [number, NodeState] | null;

const c = (...items: Item[]): Cells =>
    items.map((it) =>
        it === null ? null : typeof it === "number" ? { value: it } : { value: it[0], state: it[1] },
    );

function frame(line: number, caption: string, cells: Cells, ptrs?: Ptrs, vars?: Vars): ArrayFrame {
    return { line, caption, cells, ...(ptrs && { ptrs }), ...(vars && { vars }) };
}

const E = null; // célula vazia

/* ───────────────────────── versão 1: sem circularidade ───────────────────────── */

export const filaVetorLinear: ArraySimData = {
    kind: "array",
    title: "Fila com vetor · versão simples",
    orientation: "horizontal",
    capacity: 5,
    code: `#define MAX 5
int v[MAX];
int ini = 0, fim = 0;

void add(int x)
{
    v[fim++] = x;
}

int remover()
{
    int valor = v[ini];
    v[ini] = 0;
    ini++;
    return valor;
}

int main()
{
    add(1);
    add(2);
    add(3);
    remover();
    remover();
    add(4);
    add(5);
    add(6);
}`,
    frames: [
        frame(
            3,
            "Fila vazia: `ini = 0` e `fim = 0`. O `ini` marca o primeiro elemento e o `fim` marca a primeira posição livre. Posições livres guardam `0` (aqui, células vazias).",
            c(E, E, E, E, E),
            { ini: 0, fim: 0 },
            { ini: 0, fim: 0 },
        ),

        frame(20, "A `main` chama `add(1)`.", c(E, E, E, E, E), { ini: 0, fim: 0 }, { x: 1 }),
        frame(7, "`v[fim++] = x` usa o `fim` atual como índice: o `1` é guardado em `v[0]`.", c([1, "novo"], E, E, E, E), { ini: 0, fim: 0 }),
        frame(7, "Depois da escrita, o `fim++` avança: agora `fim = 1`, a próxima posição livre.", c(1, E, E, E, E), { ini: 0, fim: 1 }, { fim: 1 }),

        frame(21, "`add(2)`: o `2` vai para `v[1]` e o `fim` vira `2`. Os elementos entram sempre pela direita.", c(1, [2, "novo"], E, E, E), { ini: 0, fim: 2 }, { x: 2, fim: 2 }),
        frame(22, "`add(3)`: o `3` vai para `v[2]` e o `fim` vira `3`. A fila é `1, 2, 3`.", c(1, 2, [3, "novo"], E, E), { ini: 0, fim: 3 }, { x: 3, fim: 3 }),

        frame(12, "`remover()`: guardamos `v[ini]`, o `1`, em `valor`. O primeiro a entrar é o primeiro a sair.", c([1, "visitando"], 2, 3, E, E), { ini: 0, fim: 3 }, { valor: 1 }),
        frame(13, "`v[ini] = 0`: a posição fica livre.", c(E, 2, 3, E, E), { ini: 0, fim: 3 }),
        frame(14, "`ini++`: o `ini` avança. Agora o primeiro elemento da fila é o `2`.", c(E, 2, 3, E, E), { ini: 1, fim: 3 }, { ini: 1 }),

        frame(24, "Segundo `remover()`: devolve o `2`, zera `v[1]` e o `ini` vira `2`.", c(E, E, 3, E, E), { ini: 2, fim: 3 }, { valor: 2, ini: 2 }),

        frame(25, "`add(4)`: o `4` vai para `v[3]` e o `fim` vira `4`.", c(E, E, 3, [4, "novo"], E), { ini: 2, fim: 4 }, { x: 4, fim: 4 }),
        frame(
            26,
            "`add(5)`: o `5` vai para `v[4]` e o `fim` vira `5`. Repare: o `fim` já saiu do vetor, que só vai até `[4]`!",
            c(E, E, 3, 4, [5, "novo"]),
            { ini: 2, fim: 5 },
            { x: 5, fim: 5 },
        ),
        frame(
            27,
            "`add(6)` precisa escrever em `v[fim]`, mas `v[5]` não existe: a escrita seria fora do vetor. Isso apesar de haver duas posições livres no começo (`[0]` e `[1]`)!",
            c(E, E, 3, 4, 5),
            { ini: 2, fim: 5 },
            { x: 6 },
        ),
        frame(
            28,
            "O problema: `ini` e `fim` só andam para a direita. Depois de algum tempo de uso, os dois saem do vetor, mesmo com a fila quase vazia. A solução é fazê-los voltar ao começo: um vetor circular.",
            c(E, E, 3, 4, 5),
            { ini: 2, fim: 5 },
        ),
    ],
};

/* ───────────────────────── versão 2: vetor circular ───────────────────────── */

export const filaVetorCircular: ArraySimData = {
    kind: "array",
    title: "Fila com vetor · vetor circular",
    orientation: "horizontal",
    capacity: 5,
    code: `void add(int x)
{
    v[fim] = x;
    fim = (fim + 1) % MAX;
}

int remover()
{
    int valor = v[ini];
    v[ini] = 0;
    ini = (ini + 1) % MAX;
    return valor;
}

int main()
{
    add(1);
    add(2);
    add(3);
    remover();
    remover();
    add(4);
    add(5);
    add(6);
}`,
    frames: [
        frame(15, "`MAX = 5`, `ini = 0` e `fim = 0`: fila vazia.", c(E, E, E, E, E), { ini: 0, fim: 0 }, { ini: 0, fim: 0 }),

        frame(4, "`add(1)`: `v[fim] = x` guarda o `1` em `v[0]`. Depois `fim = (0 + 1) % 5 = 1`.", c([1, "novo"], E, E, E, E), { ini: 0, fim: 1 }, { x: 1, fim: 1 }),
        frame(4, "`add(2)`: o `2` vai para `v[1]` e `fim = (1 + 1) % 5 = 2`.", c(1, [2, "novo"], E, E, E), { ini: 0, fim: 2 }, { x: 2, fim: 2 }),
        frame(4, "`add(3)`: o `3` vai para `v[2]` e `fim = (2 + 1) % 5 = 3`.", c(1, 2, [3, "novo"], E, E), { ini: 0, fim: 3 }, { x: 3, fim: 3 }),

        frame(9, "`remover()`: guardamos `v[ini]`, o `1`, em `valor`.", c([1, "visitando"], 2, 3, E, E), { ini: 0, fim: 3 }, { valor: 1 }),
        frame(11, "`v[ini] = 0` libera a posição e `ini = (0 + 1) % 5 = 1`.", c(E, 2, 3, E, E), { ini: 1, fim: 3 }, { ini: 1 }),
        frame(11, "Outro `remover()`: devolve o `2` e `ini = (1 + 1) % 5 = 2`.", c(E, E, 3, E, E), { ini: 2, fim: 3 }, { valor: 2, ini: 2 }),

        frame(4, "`add(4)`: o `4` vai para `v[3]` e `fim = (3 + 1) % 5 = 4`.", c(E, E, 3, [4, "novo"], E), { ini: 2, fim: 4 }, { x: 4, fim: 4 }),

        frame(3, "`add(5)`: `v[fim] = x` guarda o `5` na última posição, `v[4]`.", c(E, E, 3, 4, [5, "novo"]), { ini: 2, fim: 4 }, { x: 5 }),
        frame(4, "Agora a mágica: `fim = (4 + 1) % 5 = 0`. Em vez de sair do vetor, o `fim` volta para o começo!", c(E, E, 3, 4, 5), { ini: 2, fim: 0 }, { fim: 0 }),

        frame(3, "`add(6)`: `v[fim]` é `v[0]`, que está livre. O `6` ocupa o começo do vetor.", c([6, "novo"], E, 3, 4, 5), { ini: 2, fim: 0 }, { x: 6 }),
        frame(4, "`fim = (0 + 1) % 5 = 1`. A fila tem `3`, `4`, `5` e `6`: ela dá a volta no vetor.", c(6, E, 3, 4, 5), { ini: 2, fim: 1 }, { fim: 1 }),

        frame(11, "`remover()` devolve o `3`, e `ini = (2 + 1) % 5 = 3`.", c(6, E, E, 4, 5), { ini: 3, fim: 1 }, { valor: 3, ini: 3 }),
        frame(11, "`remover()` devolve o `4`, e `ini = (3 + 1) % 5 = 4`.", c(6, E, E, E, 5), { ini: 4, fim: 1 }, { valor: 4, ini: 4 }),
        frame(
            11,
            "`remover()` devolve o `5`, e `ini = (4 + 1) % 5 = 0`: o `ini` também dá a volta e chega ao `6`, o único elemento que restou.",
            c(6, E, E, E, E),
            { ini: 0, fim: 1 },
            { valor: 5, ini: 0 },
        ),
    ],
};

/* ───────────────────────── size na fila circular ───────────────────────── */

export const filaVetorSize: ArraySimData = {
    kind: "array",
    title: "Fila com vetor · size",
    orientation: "horizontal",
    capacity: 5,
    code: `int size()
{
    if (fim > ini)
    {
        return fim - ini;
    }
    else
    {
        return fim - ini + MAX;
    }
}`,
    frames: [
        frame(1, "Caso 1: a fila não deu a volta. `ini = 1`, `fim = 3`, e os elementos são `2` e `3`.", c(E, 2, 3, E, E), { ini: 1, fim: 3 }, { ini: 1, fim: 3 }),
        frame(3, "`fim > ini`? `3 > 1`: sim. Basta contar quantas posições existem entre `ini` e `fim`.", c(E, 2, 3, E, E), { ini: 1, fim: 3 }),
        frame(5, "`return fim - ini` = 3 - 1 = 2. Dois elementos.", c(E, 2, 3, E, E), { ini: 1, fim: 3 }, { retorno: 2 }),

        frame(1, "Caso 2: a fila deu a volta. `ini = 2`, `fim = 1`, e os elementos são `3`, `4`, `5` e `6`.", c(6, E, 3, 4, 5), { ini: 2, fim: 1 }, { ini: 2, fim: 1, retorno: "-" }),
        frame(3, "`fim > ini`? `1 > 2`: não. A conta `fim - ini` daria `-1`, o que não faz sentido para um tamanho.", c(6, E, 3, 4, 5), { ini: 2, fim: 1 }),
        frame(9, "`return fim - ini + MAX` = 1 - 2 + 5 = 4. Somar `MAX` corrige a volta: são 4 elementos.", c(6, E, 3, 4, 5), { ini: 2, fim: 1 }, { retorno: 4 }),
    ],
};

/* ───────────────────────── fila cheia (versão com struct) ───────────────────────── */

export const filaVetorCheia: ArraySimData = {
    kind: "array",
    title: "Fila com vetor · fila cheia",
    orientation: "horizontal",
    capacity: 5,
    code: `void add(Fila *f, int x)
{
    f->v[f->fim] = x;
    f->fim = (f->fim + 1) % f->max;
    if (f->fim == f->ini)
    {
        printf("Fila Cheia\\n");
        exit(1);
    }
}`,
    frames: [
        frame(
            1,
            "A fila tem 4 elementos (`1`, `2`, `3`, `4`). O `fim` aponta para a última posição livre, `[4]`. Vamos chamar `add(f, 5)`.",
            c(1, 2, 3, 4, E),
            { ini: 0, fim: 4 },
            { max: 5, x: 5, ini: 0, fim: 4 },
        ),
        frame(3, "`f->v[f->fim] = x`: o `5` é guardado em `v[4]`. Agora o vetor está totalmente ocupado.", c(1, 2, 3, 4, [5, "novo"]), { ini: 0, fim: 4 }),
        frame(
            4,
            "`f->fim = (4 + 1) % 5 = 0`: o `fim` deu a volta e alcançou exatamente o `ini`. Os dois marcadores estão na mesma posição.",
            c(1, 2, 3, 4, 5),
            { ini: 0, fim: 0 },
            { fim: 0 },
        ),
        frame(
            5,
            "`f->fim == f->ini`? Sim. Mas `ini == fim` também é o jeito de reconhecer uma fila vazia! O código não consegue distinguir as duas situações, então trata esta como fila cheia.",
            c(1, 2, 3, 4, 5),
            { ini: 0, fim: 0 },
        ),
        frame(7, "Mostramos a mensagem de erro.", c(1, 2, 3, 4, 5), { ini: 0, fim: 0 }),
        frame(
            8,
            "`exit(1)` encerra o programa. Moral: com `max = 5`, esta fila só aguenta `max - 1 = 4` elementos. Uma posição precisa ficar sempre livre para `ini == fim` significar apenas fila vazia.",
            c(1, 2, 3, 4, 5),
            { ini: 0, fim: 0 },
        ),
    ],
};

/* ───────────────────────── registro ───────────────────────── */

/** Use no registro: `export const sims = { ...(existentes), ...filaVetorSims }` */
export const filaVetorSims = {
    filaVetorLinear,
    filaVetorCircular,
    filaVetorSize,
    filaVetorCheia,
};