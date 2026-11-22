import type { ArraySimData } from "../types";
import { at, ptr, createRecorder, type Marks } from "../ordenacao/sort-helpers";

/**
 * Simulação da questão 30 (tempo de execução): o índice dos salários calculado em O(n).
 *
 * Em vez de testar todos os PARES (i, j), uma única passada conta quantos salários são
 * "baixos" (< 2000) e quantos são "altos" (> 5000). O número de pares é baixos × altos.
 * - Amarelo = salário que está sendo examinado agora.
 * - Verde   = salário já contado (baixo ou alto). Os do meio (de 2000 a 5000) não contam.
 *
 * Os frames são GERADOS: `build()` executa o algoritmo de verdade e grava cada passo.
 * O `line` assume que `code` começa na 1ª linha da função.
 */

const SALARIOS = [1500, 6000, 3000, 1800, 7000, 5200];

const code = `double indiceLinear(int salar[], int n)
{
    int baixos = 0;
    int altos = 0;

    for (int i = 0; i < n; i++)
    {
        if (salar[i] < 2000)
        {
            baixos++;
        }
        else if (salar[i] > 5000)
        {
            altos++;
        }
    }

    double idx = (double)baixos * altos;
    return idx / ((double)n * n);
}`;

function build() {
    const v = [...SALARIOS];
    const n = v.length;
    const rec = createRecorder(v);

    const contados: number[] = [];
    const marks = (atual: number): Marks => {
        const m: Marks = {};
        for (const p of contados) Object.assign(m, at(p, "achado"));
        return Object.assign(m, at(atual, "visitando"));
    };

    let baixos = 0;
    let altos = 0;

    rec.add(3, "`baixos = 0`: vai contar os salários menores que 2000.", {}, { n, baixos });
    rec.add(4, "`altos = 0`: vai contar os salários maiores que 5000.", {}, { n, baixos, altos });

    for (let i = 0; i < n; i++) {
        const s = v[i];

        rec.add(
            8,
            `Volta \`i = ${i}\`: o salário é \`${s}\`. Será que \`${s} < 2000\`? ${s < 2000 ? "Sim." : "Não."}`,
            ptr("i", i),
            { n, baixos, altos, i },
            marks(i),
        );

        if (s < 2000) {
            baixos++;
            contados.push(i);
            rec.add(
                10,
                `É um salário baixo: \`baixos++\` e agora \`baixos = ${baixos}\`.`,
                ptr("i", i),
                { n, baixos, altos, i },
                marks(i),
            );
        } else {
            rec.add(
                12,
                `Então testamos o outro lado: \`${s} > 5000\`? ${s > 5000 ? "Sim." : "Não: está no meio, não conta para nada."}`,
                ptr("i", i),
                { n, baixos, altos, i },
                marks(i),
            );

            if (s > 5000) {
                altos++;
                contados.push(i);
                rec.add(
                    14,
                    `É um salário alto: \`altos++\` e agora \`altos = ${altos}\`.`,
                    ptr("i", i),
                    { n, baixos, altos, i },
                    marks(i),
                );
            }
        }
    }

    rec.add(
        6,
        `\`i = ${n}\`: o teste \`${n} < ${n}\` é falso e o laço termina. Uma única passada pelo vetor, sem nenhum laço dentro de outro.`,
        {},
        { n, baixos, altos },
        marks(-1),
    );

    const idx = baixos * altos;
    rec.add(
        18,
        `\`idx = baixos × altos\` = ${baixos} × ${altos} = ${idx}. Cada salário baixo forma um par com cada salário alto: são ${idx} pares, o mesmo que o laço duplo contaria um a um.`,
        {},
        { n, baixos, altos, idx },
        marks(-1),
    );

    const resultado = Number((idx / (n * n)).toFixed(4));
    rec.add(
        19,
        `\`return idx / (n * n)\` = ${idx} / ${n * n} ≈ ${String(resultado).replace(".", ",")}.`,
        {},
        { n, idx, retorno: resultado },
        marks(-1),
    );

    rec.add(
        20,
        "A função termina. As variáveis locais deixam de existir e sobra só o valor devolvido.",
        {},
        { retorno: resultado },
        marks(-1),
    );

    return rec.frames;
}

export const indiceLinear: ArraySimData = {
    kind: "array",
    title: "Índice dos salários em O(n)",
    orientation: "horizontal",
    capacity: SALARIOS.length,
    code,
    frames: build(),
};