import type { Sim } from "./types";
import { createListRecorder } from "./listRecorder";

function build() {
  const values = [3, 5, 8, 2];
  const n = values.length;
  const k = 2;
  const r = createListRecorder(values); // a b c d
  const ids = ["a", "b", "c", "d"];

  // "passos" = quantas vezes algum ponteiro andou de um nó para o próximo
  let passos = 0;

  r.add(1, `\`busca(li, ${k})\` na lista [3, 5, 8, 2] (versão ineficiente). Vamos contar os **passos** de ponteiro.`, {}, { k, passos });

  for (let i = 0; i < n; i++) {
    passos += n;
    r.add(3, `\`i < size(li)\`: o \`size\` percorre a lista **inteira** (${n} passos) só para dizer que ela tem ${n} nós. Isso acontece **a cada volta**!`,
      {}, { i, passos });

    passos += i;
    r.add(5, i === 0
      ? "`get(li, 0)`: o nó da posição 0 é o próprio primeiro: 0 passos."
      : `\`get(li, ${i})\`: **recomeça do \`ini\`** e anda ${i} vez${i > 1 ? "es" : ""}. Os nós que já visitamos na volta anterior são visitados de novo!`,
      { get: ids[i] }, { i, passos }, { [ids[i]]: "visitando" });

    const hit = values[i] === k;
    r.add(6, `\`no->valor == k\`? \`${values[i]} == ${k}\`? ${hit ? "**Sim!** 🎉" : "Não."}`,
      { get: ids[i] }, { i, passos }, { [ids[i]]: hit ? "achado" : "visitando" });

    if (hit) break;
  }

  r.add(8, `\`return 1\`: achou, mas gastou **${passos} passos** para uma lista de só ${n} nós. A versão eficiente gastaria ${n - 1}. 😬`,
    {}, { passos, retorno: 1 }, { d: "achado" });

  return r.frames;
}

export const buscaLenta: Sim = {
  title: "busca (ineficiente)",
  code: String.raw`int busca(Lista *li, int k)
{
    for (int i = 0; i < size(li); i++)
    {
        No *no = get(li, i);
        if (no->valor == k)
        {
            return 1;
        }
    }
    return 0;
}`,
  frames: build(),
};
