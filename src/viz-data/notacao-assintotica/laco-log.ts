import type { ArraySimData } from "../types";
import { at, ptr, createRecorder, type Marks } from "../ordenacao/sort-helpers";

/**
 * Simulação do `f3` (questão 16 de Notação Assintótica): o laço em que `i` DOBRA a cada volta.
 *
 * O vetor desenhado é uma "régua" 0..n-1 (n = 10). O marcador `i` pula pela régua em 1, 2, 4, 8
 * e depois sai dela (16): só 4 voltas para n = 10, ou seja, cerca de lg n.
 * - Amarelo = posição onde o `i` está agora.
 * - Verde   = posições que o `i` já visitou.
 *
 * Os frames são GERADOS: `build()` executa o laço de verdade e grava cada passo.
 * O `line` assume que `code` começa na 1ª linha da função.
 */

const N = 10;

const code = `int f3(int n)
{
    int aux = 0;
    for (int i = 1; i < n; i = i * 2)
    {
        aux++;
    }
    return aux;
}`;

function build() {
    const v = Array.from({ length: N }, (_, k) => k); // a régua: 0, 1, ..., 9
    const rec = createRecorder(v);

    // posições já visitadas pelo i (ficam verdes)
    const visitadas: number[] = [];
    const marks = (atual: number): Marks => {
        const m: Marks = {};
        for (const p of visitadas) Object.assign(m, at(p, "achado"));
        return Object.assign(m, at(atual < N ? atual : -1, "visitando"));
    };

    let aux = 0;
    rec.add(
        3,
        "`aux = 0`: ele vai contar quantas voltas o laço dá. A régua ao lado vai de `0` até `n - 1`, com `n = 10`.",
        {},
        { n: N, aux },
    );

    let i = 1;
    rec.add(
        4,
        "`i = 1` e o teste `i < n` vale: `1 < 10`. O marcador `i` aponta para a posição 1.",
        ptr("i", i),
        { n: N, aux, i },
        marks(i),
    );

    while (i < N) {
        visitadas.push(i);
        aux++;
        rec.add(
            6,
            `Corpo do laço: \`aux++\` e agora \`aux = ${aux}\`. Esta foi a volta número ${aux}.`,
            ptr("i", i),
            { n: N, aux, i },
            marks(i),
        );

        i = i * 2;
        if (i < N) {
            rec.add(
                4,
                `\`i = i * 2\` vira \`${i}\`: o \`i\` pulou de ${i / 2} para ${i}, em vez de andar uma casa só. Teste: \`${i} < ${N}\` vale, o laço continua.`,
                ptr("i", i),
                { n: N, aux, i },
                marks(i),
            );
        } else {
            rec.add(
                4,
                `\`i = i * 2\` vira \`${i}\`. Teste: \`${i} < ${N}\` é falso, então o \`i\` saiu da régua e o laço termina.`,
                {},
                { n: N, aux, i },
                marks(-1),
            );
        }
    }

    rec.add(
        8,
        `\`return aux\`: o laço deu ${aux} voltas para \`n = ${N}\`. Como o \`i\` dobra a cada volta, são cerca de lg ${N} voltas (lg 10 ≈ 3,3, arredondado para cima dá ${aux}).`,
        {},
        { n: N, aux },
        marks(-1),
    );

    rec.add(
        9,
        `A função termina e devolve ${aux}. As variáveis locais \`aux\` e \`i\` deixam de existir. Dobrar \`n\` acrescenta só uma volta: por isso o custo é \`Θ(lg n)\`.`,
        {},
        { retorno: aux },
        marks(-1),
    );

    return rec.frames;
}

export const lacoLog: ArraySimData = {
    kind: "array",
    title: "f3 · o i dobra a cada volta",
    orientation: "horizontal",
    capacity: N,
    code,
    frames: build(),
};