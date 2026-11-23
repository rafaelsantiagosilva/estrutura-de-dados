import type { NodeState } from "../types";
import type {
    TreeFrame,
    TreeHole,
    TreeNode,
    TreeSimData,
    TreeXmlFrame,
    TreeXmlSimData,
    XmlLine,
} from "./treeTypes";

/**
 * Simulações de ÁRVORES BINÁRIAS (TreeSim / TreeXmlSim).
 *
 * Cores: verde (achado) = nó já impresso/escrito, ou nó "especial" da explicação;
 *        amarelo (visitando) = nó que o ponteiro `aux`/`no` está usando agora;
 *        verde (novo) = nó que acabou de ser inserido.
 * Os frames de inserção e de percurso são GERADOS por funções que rodam o algoritmo de verdade.
 */

/* ───────────────────────── helpers ───────────────────────── */

/** nó: tn("a", 7, "b", "c") = valor 7, esq = "b", dir = "c". */
const tn = (id: string, value: number, esq: string | null = null, dir: string | null = null, state?: NodeState): TreeNode => ({
    id,
    value,
    esq,
    dir,
    ...(state && { state }),
});

/** pinta os nós `ids` com o estado `state` */
const mark = (nodes: TreeNode[], ids: string[], state: NodeState): TreeNode[] =>
    nodes.map((n) => (ids.includes(n.id) ? { ...n, state } : n));

function fr(line: number | undefined, caption: string, root: string | null, nodes: TreeNode[], extra: Partial<TreeFrame> = {}): TreeFrame {
    return { ...(line !== undefined && { line }), caption, root, nodes, ...extra };
}

/* ───────────────────────── árvore de busca "de verdade" (para gerar frames) ───────────────────────── */

type M = { id: string; value: number; esq: M | null; dir: M | null };

/** `leq = true`: valor <= nó vai para a esquerda (addNo recursivo). `false`: só `<` vai (addTreeIt iterativo). */
function makeBst(leq: boolean) {
    let root: M | null = null;
    let count = 0;

    function add(value: number): M {
        const m: M = { id: `n${++count}`, value, esq: null, dir: null };
        if (!root) {
            root = m;
            return m;
        }
        let cur: M = root;
        for (; ;) {
            const left = leq ? value <= cur.value : value < cur.value;
            const next = left ? cur.esq : cur.dir;
            if (!next) {
                if (left) cur.esq = m;
                else cur.dir = m;
                return m;
            }
            cur = next;
        }
    }

    return { add, root: () => root };
}

function snap(root: M | null, states: Record<string, NodeState> = {}): TreeNode[] {
    const out: TreeNode[] = [];
    const walk = (m: M | null) => {
        if (!m) return;
        out.push({ id: m.id, value: m.value, esq: m.esq?.id ?? null, dir: m.dir?.id ?? null, ...(states[m.id] && { state: states[m.id] }) });
        walk(m.esq);
        walk(m.dir);
    };
    walk(root);
    return out;
}

/* ───────────────────────── código das simulações ───────────────────────── */

const addNoCode = `void addNo(No *no, int valor)
{
    if (valor <= no->valor)
    {
        // insere na subárvore à esquerda
        if (no->esq != NULL)
        {
            addNo(no->esq, valor);
        }
        else
        {
            no->esq = newNo(valor);
        }
    }
    else
    {
        // insere na subárvore à direita
        if (no->dir != NULL)
        {
            addNo(no->dir, valor);
        }
        else
        {
            no->dir = newNo(valor);
        }
    }
}`;

const addTreeItCode = `void addTreeIt(Tree *t, int valor)
{
    if (t->raiz == NULL)
    {
        t->raiz = newNo(valor);
        return;
    }
    No *aux = t->raiz;
    int inseriu = FALSE;
    while (!inseriu)
    {
        if (valor < aux->valor)
        {
            if (aux->esq != NULL)
            {
                aux = aux->esq;
            }
            else
            {
                aux->esq = newNo(valor);
                inseriu = TRUE;
            }
        }
        else
        {
            if (aux->dir != NULL)
            {
                aux = aux->dir;
            }
            else
            {
                aux->dir = newNo(valor);
                inseriu = TRUE;
            }
        }
    }
}`;

/* ───────────────────────── gerador: inserção na árvore de busca ───────────────────────── */

/**
 * Insere `values` (um a um) em uma árvore que já contém `initial`, gerando os frames do passo a passo.
 * mode "it"  → addTreeIt (iterativo, ponteiro `aux`)
 * mode "rec" → addNo (recursivo, parâmetro `no`) — exige árvore inicial não vazia
 */
function insertFrames(mode: "it" | "rec", initial: number[], values: number[]): TreeFrame[] {
    const rec = mode === "rec";
    const holder = rec ? "no" : "aux";
    const b = makeBst(rec);
    initial.forEach((v) => b.add(v));
    const frames: TreeFrame[] = [];

    const r00 = b.root();
    frames.push(
        fr(
            1,
            initial.length
                ? `Esta é a árvore. Vamos inserir ${values.join(", ")}.`
                : `Árvore vazia (\`raiz == NULL\`). Vamos inserir, nesta ordem: ${values.join(", ")}.`,
            r00 ? r00.id : null,
            snap(r00),
        ),
    );

    values.forEach((v) => {
        const vars = { valor: v };
        const r0 = b.root();

        if (!r0) {
            frames.push(fr(3, `Inserindo ${v}: a árvore está vazia (\`raiz == NULL\`), então o novo nó vira a raiz.`, null, [], { vars }));
            const m = b.add(v);
            frames.push(fr(5, `A raiz passa a ser um nó novo com o valor ${v}.`, m.id, snap(b.root(), { [m.id]: "novo" }), { vars }));
            return;
        }

        if (!rec) {
            frames.push(fr(8, `Inserindo ${v}: o ponteiro \`aux\` começa na raiz.`, r0.id, snap(r0, { [r0.id]: "visitando" }), { ptrs: { aux: r0.id }, vars }));
        }

        let cur: M = r0;
        for (; ;) {
            const goLeft = rec ? v <= cur.value : v < cur.value;
            const side: "esq" | "dir" = goLeft ? "esq" : "dir";
            const dest = goLeft ? "esquerda" : "direita";
            const child = goLeft ? cur.esq : cur.dir;
            const test = rec ? `${v} <= ${cur.value}` : `${v} < ${cur.value}`;
            const here = { [holder]: cur.id };
            const visiting = { [cur.id]: "visitando" as NodeState };
            const tail = child
                ? ` Já existe um nó à ${dest}, então descemos por ele.`
                : ` O ramo da ${dest} está vazio (NULL): achamos o lugar!`;
            const holes: TreeHole[] | undefined = child ? undefined : [{ parent: cur.id, side }];

            frames.push(
                fr(rec ? 3 : 12, `\`${test}\` é ${goLeft ? "verdadeiro" : "falso"}: o ${v} vai para a ${dest} do ${cur.value}.${tail}`, r0.id, snap(b.root(), visiting), {
                    ptrs: here,
                    vars,
                    ...(holes && { holes }),
                }),
            );

            if (child) {
                if (rec) {
                    frames.push(
                        fr(goLeft ? 6 : 18, `\`no->${side} != NULL\`: há uma subárvore ali. Vamos resolver o problema dentro dela.`, r0.id, snap(b.root(), visiting), { ptrs: here, vars }),
                    );
                    frames.push(
                        fr(
                            goLeft ? 8 : 20,
                            `Chamada recursiva \`addNo(no->${side}, ${v})\`: o nó ${child.value} passa a ser o \`no\`, a raiz da subárvore.`,
                            r0.id,
                            snap(b.root(), { [child.id]: "visitando" }),
                            { ptrs: { no: child.id }, vars },
                        ),
                    );
                } else {
                    frames.push(
                        fr(goLeft ? 16 : 28, `\`aux = aux->${side}\`: o \`aux\` desce para o nó ${child.value}.`, r0.id, snap(b.root(), { [child.id]: "visitando" }), {
                            ptrs: { aux: child.id },
                            vars,
                        }),
                    );
                }
                cur = child;
                continue;
            }

            // achou o ponteiro NULL: cria o nó
            if (rec) {
                frames.push(
                    fr(goLeft ? 6 : 18, `\`no->${side} != NULL\`? Não: o ponteiro vale NULL, é aqui que o valor entra.`, r0.id, snap(b.root(), visiting), {
                        ptrs: here,
                        vars,
                        holes: [{ parent: cur.id, side }],
                    }),
                );
            }
            const m = b.add(v);
            frames.push(
                fr(
                    goLeft ? (rec ? 12 : 20) : rec ? 24 : 32,
                    `\`${holder}->${side} = newNo(${v})\`: o ponteiro que valia NULL passa a apontar para o nó novo. Inserido!`,
                    r0.id,
                    snap(b.root(), { [m.id]: "novo" }),
                    { ptrs: here, vars },
                ),
            );
            break;
        }
    });

    const rf = b.root();
    frames.push(fr(rec ? 27 : 37, values.length > 1 ? "Todos os valores foram inseridos." : `O ${values[0]} foi inserido. A função termina.`, rf ? rf.id : null, snap(rf)));
    return frames;
}

/* ───────────────────────── gerador: percursos (em-ordem, pré-ordem, pós-ordem) ───────────────────────── */

type TLines = { start: number; callL: number; callR: number; nullRet: number; print: number; end: number };

function traversalFrames(
    spec: TreeNode[],
    rootId: string,
    order: "in" | "pre" | "post",
    L: TLines,
    fn: string,
    outName: string,
    verb: string,
    fmt: (vals: number[]) => string,
): TreeFrame[] {
    const byId = new Map(spec.map((n) => [n.id, n] as const));
    const done = new Set<string>();
    const out: number[] = [];
    const frames: TreeFrame[] = [];

    const nodes = (cur: string | null): TreeNode[] =>
        spec.map((n) => ({
            id: n.id,
            value: n.value,
            esq: n.esq,
            dir: n.dir,
            ...(n.id === cur ? { state: "visitando" as NodeState } : done.has(n.id) ? { state: "achado" as NodeState } : {}),
        }));

    const push = (line: number, caption: string, cur: string | null, holes?: TreeHole[]) =>
        frames.push(
            fr(line, caption, rootId, nodes(cur), {
                ...(cur && { ptrs: { no: cur } }),
                ...(holes && { holes }),
                vars: { [outName]: fmt(out) },
            }),
        );

    const emit = (m: TreeNode, caption: string) => {
        out.push(m.value);
        done.add(m.id);
        push(L.print, caption, m.id);
    };

    const go = (id: string | null, parent: TreeNode | null, side: "esq" | "dir") => {
        if (id === null) {
            push(L.nullRet, `\`${fn}(NULL)\`: não há nó ali, então a função retorna na hora.`, null, parent ? [{ parent: parent.id, side }] : undefined);
            return;
        }
        const m = byId.get(id)!;
        const v = m.value;

        if (order === "pre") emit(m, `Primeiro a raiz: ${verb} o ${v}.`);
        push(L.callL, order === "pre" ? `Depois, o ramo da esquerda do ${v}.` : `\`${fn}(${v})\`: primeiro o ramo da esquerda.`, id);
        go(m.esq, m, "esq");
        if (order === "in") emit(m, `De volta ao ${v}: agora ${verb} o ${v}.`);
        push(L.callR, order === "post" ? `Depois, o ramo da direita do ${v}.` : `Agora o ramo da direita do ${v}.`, id);
        go(m.dir, m, "dir");
        if (order === "post") emit(m, `Por último a raiz: ${verb} o ${v}.`);
    };

    push(L.start, `Chamamos \`${fn}(raiz)\`. Cada chamada recursiva trata uma subárvore.`, rootId);
    go(rootId, null, "esq");
    frames.push(fr(L.end, `Fim. ${outName === "saida" ? "Saída" : "Resultado"}: ${fmt(out)}.`, rootId, nodes(null), { vars: { [outName]: fmt(out) } }));
    return frames;
}

const fmtSaida = (vals: number[]) => (vals.length ? vals.map((v) => `${v},`).join("") : "(vazia)");
const fmtLista = (vals: number[]) => `[${vals.join(", ")}]`;

/** Árvore binária (NÃO de busca) da Figura 11.15: mostra que o percurso funciona em qualquer árvore binária. */
const T115 = (): TreeNode[] => [tn("a", 9, null, "b"), tn("b", 3, "c", "d"), tn("c", 5, "e"), tn("d", 7), tn("e", 10)];

/** Árvore de busca da `main` da aula: inserções 6, 8, 2, 10, 7, 1, 3. */
const T117 = (): TreeNode[] => [tn("a", 6, "b", "c"), tn("b", 2, "d", "e"), tn("d", 1), tn("e", 3), tn("c", 8, "f", "g"), tn("f", 7), tn("g", 10)];

/** Árvore de busca criada a partir da lista [7, 3, 9, 1, 5] (TreeSort). */
const TSORT = (): TreeNode[] => [tn("a", 7, "b", "c"), tn("b", 3, "d", "e"), tn("d", 1), tn("e", 5), tn("c", 9)];

/* ───────────────────────── 1) o que é uma árvore ───────────────────────── */

const noStructCode = `typedef struct No
{
    int valor;
    struct No *esq, *dir;
} No;`;

/** Figura 11.4: raiz 1; filhos 7 e 9; ... */
const T114 = (): TreeNode[] => [
    tn("a", 1, "b", "c"),
    tn("b", 7, "d", "e"),
    tn("d", 2),
    tn("e", 6, "f", "g"),
    tn("f", 5),
    tn("g", 11),
    tn("c", 9, null, "h"),
    tn("h", 9, "i", null),
    tn("i", 5),
];

export const arvoreTermos: TreeSimData = {
    kind: "tree",
    title: "Árvore · raiz, pai, filho e folha",
    code: noStructCode,
    frames: [
        fr(undefined, "Esta é uma árvore enraizada. Os quadrados são os nós (vértices) e as setas são as arestas. Não há ciclos, e tudo está conectado.", "a", T114()),
        fr(undefined, "O nó `1` fica no topo: é a raiz. De cima para baixo, cada nó se liga aos seus filhos.", "a", mark(T114(), ["a"], "achado")),
        fr(undefined, "Cada par de nós ligados tem uma relação de pai e filho. O `1` é pai do `7` e do `9`; os dois são filhos do `1`.", "a", mark(mark(T114(), ["a"], "achado"), ["b", "c"], "visitando")),
        fr(undefined, "O `7` é pai do `2` e do `6`. Repare: o `7` é pai (dos nós de baixo) e filho (do `1`) ao mesmo tempo.", "a", mark(mark(T114(), ["b"], "achado"), ["d", "e"], "visitando")),
        fr(undefined, "Nós sem filhos são as folhas: aqui, `2`, `5`, `11` e `5`. Elas ficam, geralmente, na parte de baixo.", "a", mark(T114(), ["d", "f", "g", "i"], "visitando")),
        fr(undefined, "Cada nó tem, no máximo, dois filhos (um à esquerda e um à direita): esta é uma árvore binária.", "a", T114()),
    ],
};

export const arvoreSubarvores: TreeSimData = {
    kind: "tree",
    title: "Árvore · subárvores",
    code: noStructCode,
    frames: [
        fr(undefined, "A árvore inteira, com raiz `1`.", "a", T114()),
        fr(undefined, "Cada filho da raiz é a raiz de uma subárvore. Esta é a subárvore da esquerda, com raiz `7`.", "a", mark(T114(), ["b", "d", "e", "f", "g"], "visitando")),
        fr(undefined, "E esta é a subárvore da direita, com raiz `9`.", "a", mark(T114(), ["c", "h", "i"], "visitando")),
        fr(undefined, "Dentro da subárvore do `7`, o nó `6` também é raiz de uma subárvore (com `5` e `11`), e assim por diante.", "a", mark(T114(), ["e", "f", "g"], "achado")),
        fr(undefined, "No fim, cada folha é uma árvore com um único nó. Por isso a árvore é uma estrutura recursiva: cada filho de um nó é, ele mesmo, uma árvore.", "a", mark(T114(), ["d", "f", "g", "i"], "visitando")),
    ],
};

export const arvoreAlturas: TreeSimData = {
    kind: "tree",
    title: "Árvore · altura",
    code: noStructCode,
    frames: [
        fr(undefined, "Uma árvore nula (sem nenhum nó) tem, por definição, altura `-1`.", null, [], { vars: { altura: -1 } }),
        fr(undefined, "Um único nó: o caminho da raiz até uma folha tem 0 arestas. Altura `0`.", "a", [tn("a", 5)], { vars: { altura: 0 } }),
        fr(undefined, "Raiz com dois filhos: o maior caminho da raiz até uma folha tem 1 aresta. Altura `1`.", "a", mark([tn("a", 6, "b", "c"), tn("b", 5), tn("c", 7)], ["a", "b"], "visitando"), { vars: { altura: 1 } }),
        fr(
            undefined,
            "Agora o maior caminho é `3 → 6 → 5`, com 2 arestas. Altura `2`.",
            "a",
            mark([tn("a", 3, null, "b"), tn("b", 6, "c", "d"), tn("c", 5), tn("d", 7)], ["a", "b", "c"], "visitando"),
            { vars: { altura: 2 } },
        ),
        fr(
            undefined,
            "O maior caminho é `3 → 6 → 5 → 4`, com 3 arestas. Altura `3`. A altura é o maior caminho da raiz até uma folha.",
            "a",
            mark([tn("a", 3, null, "b"), tn("b", 6, "c", "d"), tn("c", 5, "e"), tn("d", 7), tn("e", 4)], ["a", "b", "c", "e"], "visitando"),
            { vars: { altura: 3 } },
        ),
    ],
};

/* ───────────────────────── 2) construindo uma árvore binária ───────────────────────── */

export const arvoreMain: TreeSimData = {
    kind: "tree",
    title: "Árvore binária · montando na main",
    code: `int main(int argc, const char *argv[])
{
    Tree *t = newTree();
    t->raiz = newNo(5);
    t->raiz->esq = newNo(6);
    t->raiz->dir = newNo(7);
    t->raiz->dir->esq = newNo(2);
    return 0;
}`,
    frames: [
        fr(3, "`newTree()` cria a árvore vazia: `t->raiz` vale `NULL`. Ainda não existe nenhum nó.", null, []),
        fr(4, "`t->raiz = newNo(5)`: o primeiro nó é criado e passa a ser a raiz.", "a", [tn("a", 5, null, null, "novo")], { ptrs: { raiz: "a" } }),
        fr(5, "`t->raiz->esq = newNo(6)`: o `esq` da raiz passa a apontar para um nó novo, o `6`.", "a", [tn("a", 5, "b"), tn("b", 6, null, null, "novo")], { ptrs: { raiz: "a" } }),
        fr(6, "`t->raiz->dir = newNo(7)`: o `dir` da raiz passa a apontar para o `7`.", "a", [tn("a", 5, "b", "c"), tn("b", 6), tn("c", 7, null, null, "novo")], { ptrs: { raiz: "a" } }),
        fr(7, "`t->raiz->dir->esq = newNo(2)`: andamos até o `7` (`raiz->dir`) e penduramos o `2` no seu `esq`.", "a", [tn("a", 5, "b", "c"), tn("b", 6), tn("c", 7, "d"), tn("d", 2, null, null, "novo")], { ptrs: { raiz: "a" } }),
        fr(
            8,
            "Árvore pronta. Os quadradinhos tracejados mostram os ponteiros que valem `NULL`: as folhas não têm filhos, e o `7` não tem filho à direita.",
            "a",
            [tn("a", 5, "b", "c"), tn("b", 6), tn("c", 7, "d"), tn("d", 2)],
            {
                ptrs: { raiz: "a" },
                holes: [
                    { parent: "b", side: "esq" },
                    { parent: "b", side: "dir" },
                    { parent: "c", side: "dir" },
                    { parent: "d", side: "esq" },
                    { parent: "d", side: "dir" },
                ],
            },
        ),
    ],
};

/* ───────────────────────── 3) inserção em árvore binária de busca ───────────────────────── */

export const arvoreAddRec: TreeSimData = {
    kind: "tree",
    title: "Árvore de busca · addNo (recursivo)",
    code: addNoCode,
    frames: insertFrames("rec", [3, 6, 5, 7], [4]),
};

export const arvoreAddIt: TreeSimData = {
    kind: "tree",
    title: "Árvore de busca · addTreeIt (iterativo)",
    code: addTreeItCode,
    frames: insertFrames("it", [3, 6, 5, 7], [4]),
};

export const arvoreBst5376: TreeSimData = {
    kind: "tree",
    title: "Árvore de busca · inserindo 5, 3, 7, 6",
    code: addTreeItCode,
    frames: insertFrames("it", [], [5, 3, 7, 6]),
};

export const arvoreBst3675: TreeSimData = {
    kind: "tree",
    title: "Árvore de busca · inserindo 3, 6, 7, 5",
    code: addTreeItCode,
    frames: insertFrames("it", [], [3, 6, 7, 5]),
};

export const arvoreBst3567: TreeSimData = {
    kind: "tree",
    title: "Árvore de busca · inserindo 3, 5, 6, 7 (degenerada)",
    code: addTreeItCode,
    frames: insertFrames("it", [], [3, 5, 6, 7]),
};

/* ───────────────────────── 4) percursos ───────────────────────── */

export const arvoreEmOrdem: TreeSimData = {
    kind: "tree",
    title: "Árvore · impressão em-ordem",
    code: `void printNo(No *no)
{
    if (no == NULL)
    {
        return;
    }
    // ramo da esquerda
    printNo(no->esq);
    // raiz
    printf("%d,", no->valor);
    // ramo da direita
    printNo(no->dir);
}`,
    frames: traversalFrames(T115(), "a", "in", { start: 1, callL: 8, callR: 12, nullRet: 5, print: 10, end: 13 }, "printNo", "saida", "imprimimos", fmtSaida),
};

export const arvorePreOrdem: TreeSimData = {
    kind: "tree",
    title: "Árvore · impressão pré-ordem",
    code: `void printNo(No *no)
{
    if (no == NULL)
    {
        return;
    }
    printf("%d,", no->valor);
    printNo(no->esq);
    printNo(no->dir);
}`,
    frames: traversalFrames(T115(), "a", "pre", { start: 1, callL: 8, callR: 9, nullRet: 5, print: 7, end: 10 }, "printNo", "saida", "imprimimos", fmtSaida),
};

export const arvorePosOrdem: TreeSimData = {
    kind: "tree",
    title: "Árvore · impressão pós-ordem",
    code: `void printNo(No *no)
{
    if (no == NULL)
    {
        return;
    }
    printNo(no->esq);
    printNo(no->dir);
    printf("%d,", no->valor);
}`,
    frames: traversalFrames(T115(), "a", "post", { start: 1, callL: 7, callR: 8, nullRet: 5, print: 9, end: 10 }, "printNo", "saida", "imprimimos", fmtSaida),
};

export const arvoreTreeSort: TreeSimData = {
    kind: "tree",
    title: "TreeSort · percurso que devolve os valores à lista",
    code: `void percurso(No *no, Lista *l)
{
    if (no == NULL)
    {
        return;
    }
    percurso(no->esq, l);
    addLista(l, no->valor);
    percurso(no->dir, l);
}`,
    frames: traversalFrames(TSORT(), "a", "in", { start: 1, callL: 7, callR: 9, nullRet: 5, print: 8, end: 10 }, "percurso", "lista", "adicionamos à lista", fmtLista),
};

/* ───────────────────────── 5) impressão em XML ───────────────────────── */

const xmlCode = `void printTreeXML(Tree *t)
{
    FILE *fp = fopen("Tree.xml", "w+");
    fprintf(fp, "<tree>\\n");
    if (t->raiz != NULL)
        printNoXML(t->raiz, fp);
    fprintf(fp, "</tree>\\n");
    fclose(fp);
}

void printNoXML(No *no, FILE *fp)
{
    fprintf(fp, "%d\\n", no->valor);
    if (no->esq != NULL)
    {
        fprintf(fp, "<esq>\\n");
        printNoXML(no->esq, fp);
        fprintf(fp, "</esq>\\n");
    }
    if (no->dir != NULL)
    {
        fprintf(fp, "<dir>\\n");
        printNoXML(no->dir, fp);
        fprintf(fp, "</dir>\\n");
    }
}`;

function xmlFrames(spec: TreeNode[], rootId: string): TreeXmlFrame[] {
    const byId = new Map(spec.map((n) => [n.id, n] as const));
    const xml: XmlLine[] = [];
    const done = new Set<string>();
    const frames: TreeXmlFrame[] = [];

    const nodes = (cur: string | null): TreeNode[] =>
        spec.map((n) => ({
            id: n.id,
            value: n.value,
            esq: n.esq,
            dir: n.dir,
            ...(n.id === cur ? { state: "visitando" as NodeState } : done.has(n.id) ? { state: "achado" as NodeState } : {}),
        }));

    const push = (line: number, caption: string, cur: string | null) =>
        frames.push({
            ...fr(line, caption, rootId, nodes(cur), cur ? { ptrs: { no: cur } } : {}),
            xml: xml.map((x) => ({ ...x })),
        });

    const go = (id: string, depth: number) => {
        const n = byId.get(id)!;
        xml.push({ text: String(n.value), depth, kind: "value" });
        const leaf = !n.esq && !n.dir;
        push(13, leaf ? `Escrevemos o valor ${n.value}. É uma folha (sem filhos), então nenhuma marca é aberta.` : `Escrevemos o valor do nó: ${n.value}.`, id);

        if (n.esq) {
            xml.push({ text: "<esq>", depth, kind: "tag" });
            push(16, `Há filho à esquerda: abrimos a marca \`<esq>\` e chamamos a recursão para esse ramo.`, id);
            go(n.esq, depth + 1);
            xml.push({ text: "</esq>", depth, kind: "tag" });
            push(18, `O ramo da esquerda terminou: fechamos \`</esq>\`.`, id);
        }
        if (n.dir) {
            xml.push({ text: "<dir>", depth, kind: "tag" });
            push(22, `Há filho à direita: abrimos a marca \`<dir>\` e chamamos a recursão para esse ramo.`, id);
            go(n.dir, depth + 1);
            xml.push({ text: "</dir>", depth, kind: "tag" });
            push(24, `O ramo da direita terminou: fechamos \`</dir>\`.`, id);
        }
        done.add(id);
    };

    push(3, "`printTreeXML` abre o arquivo `Tree.xml` para escrita.", null);
    xml.push({ text: "<tree>", depth: 0, kind: "tag" });
    push(4, "Escrevemos a marca `<tree>`: ela envolve a árvore inteira.", null);
    push(6, "A raiz não é `NULL`: chamamos `printNoXML(t->raiz, fp)`.", rootId);
    go(rootId, 1);
    xml.push({ text: "</tree>", depth: 0, kind: "tag" });
    push(7, "Voltamos da recursão e fechamos a marca `</tree>`.", null);
    push(8, "`fclose` fecha o arquivo. Cada nó virou um valor, e cada ramo virou um par de marcas `esq` ou `dir`.", null);
    return frames;
}

export const arvoreXml: TreeXmlSimData = {
    kind: "treexml",
    title: "Árvore → XML",
    code: xmlCode,
    frames: xmlFrames(T117(), "a"),
};

/* ───────────────────────── registro ───────────────────────── */

/** Use no registro: `export const sims = { ...(existentes), ...arvoreSims }` */
export const arvoreSims = {
    arvoreTermos,
    arvoreSubarvores,
    arvoreAlturas,
    arvoreMain,
    arvoreAddRec,
    arvoreAddIt,
    arvoreBst5376,
    arvoreBst3675,
    arvoreBst3567,
    arvoreEmOrdem,
    arvorePreOrdem,
    arvorePosOrdem,
    arvoreTreeSort,
    arvoreXml,
};