import type { ArraySimData } from "../types";
import { at, createRecorder, ptr } from "./sort-helpers";

const input = [8, 3, 1, 9, 2]; // o mesmo vetor da Figura 8.4 da apostila

function build() {
    const v = [...input];
    let n = v.length;
    const r = createRecorder(v);

    r.add(2, `\`bolha_iterativa(v, ${n})\`: vamos comparar **vizinhos** e trocar os que estão fora de ordem.`, {}, { n });

    while (n > 1) {
        r.add(3, `\`n > 1\`? \`${n} > 1\`? Sim: nova passada pelas ${n} primeiras posições.`, {}, { n });

        for (let i = 0; i < n - 1; i++) {
            const troca = v[i] > v[i + 1];
            const pair = { ...at(i, "visitando"), ...at(i + 1, "visitando") };

            r.add(
                7,
                `\`v[${i}] > v[${i + 1}]\`? \`${v[i]} > ${v[i + 1]}\`? ${troca ? "**Sim**: estão fora de ordem, vamos trocar." : "Não: já estão em ordem."}`,
                ptr("i", i), { i }, pair,
            );

            if (troca) {
                const aux = v[i];
                r.add(9, `\`aux = v[i]\`: guardamos o ${aux}.`, ptr("i", i), { aux }, pair);
                v[i] = v[i + 1];
                v[i + 1] = aux;
                r.add(
                    11,
                    `Linhas 10 e 11: \`v[i] = v[i+1]\` e \`v[i+1] = aux\`. O ${aux} "subiu" uma posição, como uma bolha. 🫧`,
                    ptr("i", i), { aux }, pair,
                );
            }
        }

        n--;
        r.setDone(n);
        r.add(14, `\`n--\`: o maior (${v[n]}) chegou ao fim da passada, então não precisamos mais olhar para ele. ✅`, {}, { n });
    }

    r.setDone(0);
    r.add(3, "`n > 1`? `1 > 1`? **Não.** Vetor ordenado! 🎉", {}, { n });
    return r.frames;
}

export const bolha: ArraySimData = {
    kind: "array",
    title: "bolha_iterativa",
    capacity: input.length,
    orientation: "horizontal",
    code: String.raw`void bolha_iterativa(int v[], int n)
{
    while (n > 1)
    {
        for (int i = 0; i < n - 1; i++)
        {
            if (v[i] > v[i+1])
            {
                int aux = v[i];
                v[i] = v[i+1];
                v[i+1] = aux;
            }
        }
        n--;
    }
}`,
    frames: build(),
};