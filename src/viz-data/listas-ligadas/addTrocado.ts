import type { Sim } from "./types";
import { createListRecorder } from "./listRecorder";

function build() {
  const r = createListRecorder([8, 5, 3]); // a(8) → b(5) → c(3)
  const vars = { valor: 7, idx: 1 };

  r.add(2, "`addTrocado(li, 7, 1)`: vamos inserir o 7 na posição 1 de [8, 5, 3], mas com as **duas linhas de ligação trocadas**.", {}, vars);

  r.addNode("n", 7, "novo");
  r.add(4, "`newNo(7)` cria o nó solto, como sempre.", { no: "n" }, vars);

  r.add(6, "`idx == 0`? Não. Vamos para o `else`.", { no: "n" });

  r.add(13, "`get(li, idx - 1)` devolve o nó da posição 0 (o 8): é o `anterior`.",
    { no: "n", anterior: "a" }, {}, { a: "visitando" });

  // linha 14 (trocada): anterior->prox = no
  r.get("a").next = "n";
  const lost = { b: "removido", c: "removido" } as const;
  r.add(14, "**1º (trocado):** `anterior->prox = no`. O 8 passa a apontar para o novo nó... e agora **ninguém aponta para o 5**. O 5 e o 3 ficaram **perdidos**! 😱",
    { no: "n", anterior: "a" }, {}, { a: "visitando", ...lost });

  // linha 15 (trocada): no->prox = anterior->prox  (que já é o próprio no!)
  r.get("n").next = "n";
  r.add(15, "**2º (trocado):** `no->prox = anterior->prox`. Mas `anterior->prox` **já é o `no`**! Então o novo nó aponta para **ele mesmo**. 🔁",
    { no: "n", anterior: "a" }, {}, { a: "visitando", ...lost });

  r.add(17, "Resultado: `ini → 8 → 7 → 7 → 7 → ...` (laço infinito, o `printLista` nunca termina) e os nós 5 e 3 ficaram na memória sem dono: **vazamento**. ❌",
    {}, {}, lost);

  return r.frames;
}

export const addTrocado: Sim = {
  title: "add (ordem trocada)",
  code: String.raw`// ⚠️ as duas linhas de ligação estão TROCADAS
void addTrocado(Lista *li, int valor, int idx)
{
    No *no = newNo(valor);

    if (idx == 0)
    {
        no->prox = li->ini;
        li->ini = no;
    }
    else
    {
        No *anterior = get(li, idx - 1);
        anterior->prox = no;        // 1º (trocado!)
        no->prox = anterior->prox;  // 2º (trocado!)
    }
}`,
  frames: build(),
};
