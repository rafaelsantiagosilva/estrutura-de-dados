import type { ArrayFrame, ArraySimData, Cell, NodeState, Sim } from "./types";
import { createListRecorder } from "./listas-ligadas/listRecorder";

type Marks = Record<number, NodeState>;

// fotografia do vetor, com os estados de cada posição
const cells = (v: number[], marks: Marks): Cell[] => v.map((value, k) => ({ value, state: marks[k] }));

/* ═══════════════════ 🔎 Busca sequencial (vetor) ═══════════════════ */

export const VETOR_SEQ = [2, 4, 6, 8, 9, 2, 1, 3, 5, 0]; // o vetor da apostila: NÃO está ordenado

const CODE_SEQ = String.raw`// devolve a posição da chave, ou -1 se ela não estiver no vetor
int busca(int v[], int n, int chave)
{
    for (int i = 0; i < n; i++)
    {
        if (v[i] == chave)
        {
            return i;
        }
    }
    return -1;
}`;

export function makeBuscaSeq(chave: number): ArraySimData {
    const v = VETOR_SEQ;
    const n = v.length;
    const frames: ArrayFrame[] = [];
    const conferidas: Marks = {}; // posições já comparadas: ficam apagadas
    let comparacoes = 0;

    const add = (line: number, caption: string, ptrs: Record<string, number>, vars: Record<string, string | number>, marks: Marks = {}) =>
        frames.push({ cells: cells(v, { ...conferidas, ...marks }), ptrs, vars, line, caption });

    add(2, `\`busca(v, ${n}, ${chave})\`: vamos procurar o ${chave} em [${v.join(", ")}]. O vetor **não** precisa estar ordenado.`, {}, { chave, n });
    add(4, "`i = 0`: começamos olhando a primeira posição.", { i: 0 }, { i: 0, comparações: comparacoes });

    let achou = -1;
    for (let i = 0; i < n; i++) {
        comparacoes++;
        const hit = v[i] === chave;
        add(6, `\`v[${i}] == chave\`? \`${v[i]} == ${chave}\`? ${hit ? "**Sim!** 🎉" : `Não. Passamos para a posição ${i + 1}.`}`,
            { i }, { i, comparações: comparacoes }, { [i]: hit ? "achado" : "visitando" });
        if (hit) {
            achou = i;
            break;
        }
        conferidas[i] = "descartado";
    }

    if (achou >= 0) {
        add(8, `\`return i\`: devolve a posição **${achou}**, depois de ${comparacoes} comparaç${comparacoes > 1 ? "ões" : "ão"}.${v.indexOf(chave) !== v.lastIndexOf(chave) ? " Repare: a chave aparece mais de uma vez, mas devolvemos a **primeira**." : ""}`,
            { i: achou }, { i: achou, comparações: comparacoes, retorno: achou }, { [achou]: "achado" });
    } else {
        add(4, `\`i < n\`? \`${n} < ${n}\`? **Não**: acabou o vetor e a chave não apareceu.`, {}, { i: n, comparações: comparacoes });
        add(11, `\`return -1\`: a chave **não está** no vetor. Foram ${comparacoes} comparações, uma para cada elemento: este é o **pior caso**, \`Θ(n)\`.`,
            {}, { comparações: comparacoes, retorno: -1 });
    }
    return { kind: "array", title: "busca sequencial", capacity: n, orientation: "horizontal", code: CODE_SEQ, frames };
}

/* ═══════════════════ 🔎 Busca sequencial (lista ligada) ═══════════════════ */

function buildSeqLista() {
    const chave = 5;
    const r = createListRecorder([3, 4, 9, 1, 5]); // a b c d e
    const ids = ["a", "b", "c", "d", "e"];
    const vars = { chave };

    r.add(1, "`busca(li, 5)` na lista [3, 4, 9, 1, 5]. Numa lista não existe `v[i]`: só dá para **andar** de nó em nó.", {}, vars);
    r.add(3, "`aux = li->ini`: começamos no primeiro nó.", { aux: "a" }, vars, { a: "visitando" });

    for (let i = 0; i < ids.length; i++) {
        const valor = r.get(ids[i]).value;
        const hit = valor === chave;
        r.add(5, `\`aux->valor == chave\`? \`${valor} == ${chave}\`? ${hit ? "**Sim!** 🎉" : "Não."}`,
            { aux: ids[i] }, vars, { [ids[i]]: hit ? "achado" : "visitando" });
        if (hit) break;
        r.add(3, `\`aux = aux->prox\`: o \`aux\` anda para o próximo nó.`, { aux: ids[i + 1] }, vars, { [ids[i + 1]]: "visitando" });
    }

    r.add(7, "`return 1`: achou! Para uma lista de 5 nós foram 5 comparações, porque a chave era o último nó.", { aux: "e" }, { ...vars, retorno: 1 }, { e: "achado" });
    return r.frames;
}

export const buscaSeqLista: Sim = {
    title: "busca sequencial (lista ligada)",
    code: String.raw`int busca(Lista *li, int chave)
{
    for (No *aux = li->ini; aux != NULL; aux = aux->prox)
    {
        if (aux->valor == chave)
        {
            return 1;
        }
    }
    return 0;
}`,
    frames: buildSeqLista(),
};

/* ═══════════════════ ✂️ Busca binária (vetor ORDENADO) ═══════════════════ */

export const VETOR_BIN = [1, 2, 4, 6, 8, 9, 12, 15, 20]; // o vetor da apostila: ordenado

const CODE_BIN = String.raw`// vetor ORDENADO. Devolve a posição da chave, ou -1
int buscaBinaria(int v[], int n, int chave)
{
    int ini = 0;
    int fim = n - 1;
    while (ini <= fim)
    {
        int meio = (ini + fim) / 2;
        if (v[meio] == chave)
        {
            return meio;
        }
        if (chave < v[meio])
        {
            fim = meio - 1;
        }
        else
        {
            ini = meio + 1;
        }
    }
    return -1;
}`;

export function makeBuscaBin(chave: number): ArraySimData {
    const v = VETOR_BIN;
    const n = v.length;
    const frames: ArrayFrame[] = [];
    const descartadas: Marks = {}; // posições eliminadas: ficam apagadas
    let voltas = 0;

    // só desenha o marcador se o índice cabe no vetor (ini pode chegar a n; fim pode chegar a -1)
    const P = (ini: number, fim: number, meio?: number) => {
        const p: Record<string, number> = {};
        if (ini >= 0 && ini < n) p.ini = ini;
        if (meio !== undefined) p.meio = meio;
        if (fim >= -1 && fim < n) p.fim = fim;
        return p;
    };
    const V = (ini: number, fim: number, meio?: number) => ({
        ini, fim, ...(meio !== undefined ? { meio } : {}), restantes: Math.max(0, fim - ini + 1), voltas,
    });
    const add = (line: number, caption: string, ptrs: Record<string, number>, vars: Record<string, string | number>, marks: Marks = {}) =>
        frames.push({ cells: cells(v, { ...descartadas, ...marks }), ptrs, vars, line, caption });
    const descarta = (de: number, ate: number) => {
        for (let k = de; k <= ate; k++) descartadas[k] = "descartado";
    };

    add(2, `\`buscaBinaria(v, ${n}, ${chave})\`: procurar o ${chave} no vetor **ordenado** [${v.join(", ")}].`, {}, { chave, n });

    let ini = 0;
    add(4, "`ini = 0`: o começo da região onde a chave ainda pode estar.", P(ini, n), { ini });
    let fim = n - 1;
    add(5, `\`fim = n - 1 = ${fim}\`: o fim da região. No começo, ela é o vetor inteiro (${n} elementos).`, P(ini, fim), V(ini, fim));

    while (true) {
        const cabe = ini <= fim;
        add(6, cabe
            ? `\`ini <= fim\`? \`${ini} <= ${fim}\`? Sim: ainda restam **${fim - ini + 1}** elemento${fim - ini + 1 > 1 ? "s" : ""} para olhar.`
            : `\`ini <= fim\`? \`${ini} <= ${fim}\`? **Não**: a região ficou vazia, não sobrou onde procurar.`,
            P(ini, fim), V(ini, fim));
        if (!cabe) break;

        voltas++;
        const meio = Math.floor((ini + fim) / 2);
        add(8, `\`meio = (ini + fim) / 2 = (${ini} + ${fim}) / 2 = ${meio}\`. Olhamos só o elemento do **meio**: \`v[${meio}] = ${v[meio]}\`.`,
            P(ini, fim, meio), V(ini, fim, meio), { [meio]: "visitando" });

        if (v[meio] === chave) {
            add(9, `\`v[meio] == chave\`? \`${v[meio]} == ${chave}\`? **Sim!** 🎉`, P(ini, fim, meio), V(ini, fim, meio), { [meio]: "achado" });
            add(11, `\`return meio\`: devolve a posição **${meio}**. Foram só ${voltas} volta${voltas > 1 ? "s" : ""} para um vetor de ${n} elementos.`,
                P(ini, fim, meio), { ...V(ini, fim, meio), retorno: meio }, { [meio]: "achado" });
            return { kind: "array", title: "busca binária", capacity: n, orientation: "horizontal", code: CODE_BIN, frames };
        }

        add(9, `\`v[meio] == chave\`? \`${v[meio]} == ${chave}\`? Não.`, P(ini, fim, meio), V(ini, fim, meio), { [meio]: "visitando" });

        if (chave < v[meio]) {
            add(13, `\`chave < v[meio]\`? \`${chave} < ${v[meio]}\`? **Sim**: se a chave existe, está à **esquerda**. Dá para jogar fora o meio e tudo que está à direita.`,
                P(ini, fim, meio), V(ini, fim, meio), { [meio]: "visitando" });
            descarta(meio, fim);
            const antigo = fim;
            fim = meio - 1;
            add(15, `\`fim = meio - 1 = ${fim}\`: as posições ${meio} a ${antigo} foram **descartadas** (apagadas no desenho). Sobraram ${Math.max(0, fim - ini + 1)} elemento${fim - ini + 1 === 1 ? "" : "s"}.`,
                P(ini, fim), V(ini, fim));
        } else {
            add(13, `\`chave < v[meio]\`? \`${chave} < ${v[meio]}\`? Não, então \`chave > v[meio]\`: se existe, está à **direita**. Dá para jogar fora o meio e tudo à esquerda.`,
                P(ini, fim, meio), V(ini, fim, meio), { [meio]: "visitando" });
            descarta(ini, meio);
            const antigo = ini;
            ini = meio + 1;
            add(19, `\`ini = meio + 1 = ${ini}\`: as posições ${antigo} a ${meio} foram **descartadas** (apagadas no desenho). Sobraram ${Math.max(0, fim - ini + 1)} elemento${fim - ini + 1 === 1 ? "" : "s"}.`,
                P(ini, fim), V(ini, fim));
        }
    }

    add(22, `\`return -1\`: a chave **não está** no vetor. Em ${voltas} volta${voltas > 1 ? "s" : ""} (e não ${n}!) concluímos isso.`,
        P(ini, fim), { ...V(ini, fim), retorno: -1 });
    return { kind: "array", title: "busca binária", capacity: n, orientation: "horizontal", code: CODE_BIN, frames };
}
