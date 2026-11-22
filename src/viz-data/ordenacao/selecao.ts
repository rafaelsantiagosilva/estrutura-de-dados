import type { ArraySimData } from "../types";
import { at, createRecorder } from "./sort-helpers";

const input = [9, 8, 1, 2, 3]; // o mesmo vetor da Figura 8.3 da apostila

function build() {
    const v = [...input];
    const n = v.length;
    const r = createRecorder(v);

    r.add(1, `\`ordenacao_selecao(v, ${n})\`: vamos ordenar [${v.join(", ")}] colocando sempre o **maior** no fim.`, {}, { n });

    for (let N = n; N > 1; N--) {
        r.add(3, `\`N = ${N}\`: só olhamos as ${N} primeiras posições. O que está depois já está no lugar.`, {}, { N });

        let max = 0;
        r.add(5, "`max = 0`: começamos supondo que o maior está na posição 0.", { max }, { max });

        for (let i = 1; i < N; i++) {
            const maior = v[i] > v[max];
            r.add(
                7,
                `\`v[${i}] > v[max]\`? \`${v[i]} > ${v[max]}\`? ${maior ? "**Sim**, achamos um maior." : "Não."}`,
                { max, i }, { i }, at(i, "visitando"),
            );
            if (maior) {
                max = i;
                r.add(7, `\`max = ${i}\`: o novo maior é o ${v[i]}.`, { max, i }, { i, max }, at(i, "visitando"));
            }
        }

        const last = N - 1;
        const aux = v[last];
        const swapMarks = { ...at(last, "visitando"), ...at(max, "visitando") };

        r.add(8, `\`aux = v[${last}]\`: guardamos o último (${aux}) para não perdê-lo.`, { max }, { aux }, swapMarks);
        v[last] = v[max];
        r.add(9, `\`v[${last}] = v[max]\`: o maior (${v[last]}) vai para a última posição.`, { max }, { aux }, swapMarks);
        v[max] = aux;
        r.setDone(last);
        r.add(
            10,
            max === last
                ? `\`v[max] = aux\`: o maior já estava no fim, então a troca não mudou nada. O ${v[last]} está na posição final. ✅`
                : `\`v[max] = aux\`: o ${aux} ocupa o lugar que o maior deixou. O ${v[last]} está na posição final. ✅`,
            {}, { aux }, at(max, "visitando"),
        );
    }

    r.setDone(0);
    r.add(3, "`N > 1`? `1 > 1`? **Não.** Sobrou 1 elemento, que já está no lugar. Vetor ordenado! 🎉", {}, { N: 1 });
    return r.frames;
}

export const selecao: ArraySimData = {
    kind: "array",
    title: "ordenacao_selecao",
    capacity: input.length,
    orientation: "horizontal",
    code: String.raw`void ordenacao_selecao(int v[], int n)
{
    for (int N = n; N > 1; N--)
    {
        int max = 0;
        for (int i = 1; i < N; i++)
            if (v[i] > v[max]) max = i;
        int aux = v[N-1];
        v[N-1] = v[max];
        v[max] = aux;
    }
}`,
    frames: build(),
};