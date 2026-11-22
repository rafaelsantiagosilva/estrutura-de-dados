import type { Sim } from "../types";
import { createListRecorder } from "./listRecorder";

function build() {
  const r = createListRecorder([1, 2, 3, 4, 5]); // a b c d e
  r.get("e").next = "c"; // o último aponta para o 3: lista do TIPO B (tem ciclo)

  r.add(2, "`tipoB(li)`: o último nó (5) aponta de volta para o 3, então a lista **tem um ciclo**. Será que o algoritmo descobre isso?");

  r.add(4, "`lento = li->ini`: a tartaruga 🐢 começa no primeiro nó.", { lento: "a" });
  r.add(5, "`rapido = li->ini`: a lebre 🐇 também começa no primeiro nó.", { lento: "a", rapido: "a" });

  // 3 voltas: (lento, rapido) = (b, c), (c, e), (d, d)
  const voltas: [string, string, string, string][] = [
    ["a", "a", "b", "c"],
    ["b", "c", "c", "e"],
    ["c", "e", "d", "d"],
  ];
  const valor = (id: string) => id.charCodeAt(0) - 96; // a=1, b=2...

  for (const [l0, r0, l1, r1] of voltas) {
    r.add(7, "`rapido != NULL && rapido->prox != NULL`? Sim: a lebre ainda tem caminho à frente.", { lento: l0, rapido: r0 });
    r.add(9, `\`lento = lento->prox\`: a tartaruga anda **1** nó (vai para o ${valor(l1)}).`, { lento: l1, rapido: r0 });
    r.add(10, `\`rapido = rapido->prox->prox\`: a lebre anda **2** nós (vai para o ${valor(r1)}).`, { lento: l1, rapido: r1 });

    const igual = l1 === r1;
    r.add(12, igual
      ? `\`lento == rapido\`? **Sim!** As duas estão no nó ${valor(l1)}. 🎯`
      : `\`lento == rapido\`? Não (${valor(l1)} ≠ ${valor(r1)}). Próxima volta.`,
      { lento: l1, rapido: r1 }, {}, igual ? { [l1]: "achado" } : {});
    if (igual) break;
  }

  r.add(14, "`return 1`: se a lebre alcançou a tartaruga, só pode ser porque ambas estão **andando em círculo**: a lista é do tipo B. ✅",
    { lento: "d", rapido: "d" }, { retorno: 1 }, { d: "achado" });

  r.add(19, "Se a lista fosse do tipo A, a lebre chegaria a `NULL` e o laço terminaria com `return 0`.", {}, { retorno: 1 });

  return r.frames;
}

export const tipoB: Sim = {
  title: "tipoB",
  circular: true, // tem seta de volta: mais altura no desenho
  code: String.raw`// 0 = tipo A (termina em NULL), 1 = tipo B (tem ciclo)
int tipoB(Lista *li)
{
    No *lento = li->ini;
    No *rapido = li->ini;

    while (rapido != NULL && rapido->prox != NULL)
    {
        lento = lento->prox;         // anda 1 nó
        rapido = rapido->prox->prox; // anda 2 nós

        if (lento == rapido)
        {
            return 1; // se se encontraram, existe ciclo
        }
    }

    return 0; // o rapido chegou ao NULL: não tem ciclo
}`,
  frames: build(),
};
