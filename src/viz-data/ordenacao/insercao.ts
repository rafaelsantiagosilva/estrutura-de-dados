import type { ArraySimData } from "../types";
import { at, createRecorder, ptr, type Marks } from "./sort-helpers";

/* ───────── 1) insercaoA: UMA inserção, com "lixo" didático ───────── */

const inputA = [0, 1, 2, 4, 4, 9, 3]; // o vetor da apostila: tudo ordenado, menos o último
const LIXO = -1;

function buildA() {
    const v = [...inputA];
    const n = v.length;
    const r = createRecorder(v);
    let hole = -1;

    const marks = (i: number): Marks => ({ ...at(hole, "removido"), ...at(i, "visitando") });

    r.add(2, `\`insercaoA(v, ${n})\`: as ${n - 1} primeiras posições já estão ordenadas. Falta encaixar o último (o 3).`, {}, { n });
    r.add(4, "`lixo = -1`: um valor marcador, só para enxergarmos o buraco. O algoritmo real não precisa disso.", {}, { lixo: LIXO });

    const chave = v[n - 1];
    r.add(5, `\`chave = v[${n - 1}]\`: guardamos o ${chave} numa variável.`, {}, { chave }, at(n - 1, "novo"));

    v[n - 1] = LIXO;
    hole = n - 1;
    r.add(6, "`v[n-1] = lixo`: a posição da chave vira um **buraco** (-1).", {}, {}, marks(-1));

    let i = n - 2;
    r.add(7, `\`i = ${i}\`: começamos pelo vizinho da esquerda do buraco.`, ptr("i", i), { i }, marks(i));

    while (true) {
        const anda = i >= 0 && v[i] > chave;
        r.add(
            9,
            i < 0
                ? "`i >= 0`? Não: chegamos ao começo do vetor. Para."
                : `\`v[${i}] > chave\`? \`${v[i]} > ${chave}\`? ${anda ? "**Sim**: ele precisa andar para a direita." : "Não: achamos o lugar da chave. Para."}`,
            ptr("i", i), { i }, marks(i),
        );
        if (!anda) break;

        v[i + 1] = v[i];
        r.add(11, `\`v[${i + 1}] = v[${i}]\`: copiamos o ${v[i]} uma posição para a direita, para dentro do buraco.`, ptr("i", i), { i }, { ...at(i, "visitando"), ...at(i + 1, "novo") });

        v[i] = LIXO;
        hole = i;
        r.add(12, `\`v[${i}] = lixo\`: o buraco andou uma posição para a esquerda.`, ptr("i", i), { i }, marks(-1));

        i--;
        r.add(13, `\`i--\`: olhamos o próximo vizinho.`, ptr("i", i), { i }, marks(i));
    }

    v[i + 1] = chave;
    hole = -1;
    r.setDone(0);
    r.add(16, `\`v[${i + 1}] = chave\`: o ${chave} preenche o buraco. Vetor ordenado! ✅`, {}, { chave }, at(i + 1, "novo"));
    return r.frames;
}

export const insercaoA: ArraySimData = {
    kind: "array",
    title: "insercaoA",
    capacity: inputA.length,
    orientation: "horizontal",
    code: String.raw`// ordena o vetor, desde que esteja ordenado, a não ser o último elemento
void insercaoA(int v[], int n)
{
    int lixo = -1;
    int chave = v[n-1];
    v[n-1] = lixo;
    int i = n - 2;

    while (i >= 0 && v[i] > chave)
    {
        v[i+1] = v[i];
        v[i] = lixo;
        i--;
    }

    v[i+1] = chave;
}`.replace(/^\/\/.*\n/, "// ordena o vetor, desde que esteja ordenado, a não ser o último elemento\n"),
    frames: buildA(),
};

/* ───────── 2) insercaoIte: o vetor inteiro ───────── */

const inputB = [4, 2, 5, 1];

function buildB() {
    const v = [...inputB];
    const n = v.length;
    let N = 2;
    const r = createRecorder(v);

    r.add(1, `\`insercaoIte(v, ${n})\`: vamos inserir um elemento de cada vez em uma parte que já está ordenada.`, {}, { n });
    r.add(3, "`N = 2`: um vetor de 1 elemento já está ordenado, então começamos inserindo o segundo.", {}, { N });

    while (N <= n) {
        r.add(4, `\`N <= n\`? \`${N} <= ${n}\`? Sim: inserimos o elemento da posição ${N - 1} entre os ${N - 1} anteriores (já ordenados).`, {}, { N });

        const chave = v[N - 1];
        r.add(6, `\`chave = v[${N - 1}]\`: guardamos o ${chave}, que será inserido.`, {}, { chave }, at(N - 1, "novo"));

        let i = N - 2;
        r.add(7, `\`i = ${i}\`: começamos comparando com o vizinho da esquerda.`, ptr("i", i), { i }, at(N - 1, "novo"));

        while (true) {
            const anda = i >= 0 && v[i] > chave;
            r.add(
                8,
                i < 0
                    ? "`i >= 0`? Não: chegamos ao começo do vetor. Para."
                    : `\`v[${i}] > chave\`? \`${v[i]} > ${chave}\`? ${anda ? "**Sim**: ele anda para a direita." : "Não: achamos o lugar da chave. Para."}`,
                ptr("i", i), { i }, at(i, "visitando"),
            );
            if (!anda) break;

            v[i + 1] = v[i];
            r.add(10, `\`v[${i + 1}] = v[${i}]\`: copiamos o ${v[i]} uma posição para a direita.`, ptr("i", i), { i }, { ...at(i, "visitando"), ...at(i + 1, "novo") });

            i--;
            r.add(11, "`i--`: olhamos o próximo vizinho à esquerda.", ptr("i", i), { i }, at(i, "visitando"));
        }

        v[i + 1] = chave;
        r.add(13, `\`v[${i + 1}] = chave\`: o ${chave} entra na posição ${i + 1}. ✅ As ${N} primeiras posições estão ordenadas.`, {}, { i }, at(i + 1, "novo"));

        N++;
        r.add(14, N <= n ? `\`N++\`: N = ${N}. Passamos a considerar mais um elemento.` : `\`N++\`: N = ${N}, maior que n.`, {}, { N });
    }

    r.setDone(0);
    r.add(4, "`N <= n`? Não. Vetor ordenado! 🎉", {}, { N });
    return r.frames;
}

export const insercaoIte: ArraySimData = {
    kind: "array",
    title: "insercaoIte",
    capacity: inputB.length,
    orientation: "horizontal",
    code: String.raw`void insercaoIte(int v[], int n)
{
    int N = 2;
    while (N <= n)
    {
        int chave = v[N-1];
        int i = N - 2;
        while (i >= 0 && v[i] > chave)
        {
            v[i+1] = v[i];
            i--;
        }
        v[i+1] = chave;
        N++;
    }
}`,
    frames: buildB(),
};