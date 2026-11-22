import type { Sim } from "./types";
import { createListRecorder } from "./listRecorder";

function build() {
  const k = 3;
  const r = createListRecorder([3, 5, 3, 3, 8], { fixed: true }); // a b c d e
  const vars = { k };

  r.add(2, "`removerChave(li, 3)` na lista [3, 5, 3, 3, 8]. Queremos tirar **todos** os 3, percorrendo a lista **uma única vez**.", {}, vars);

  // ───── 1) ocorrências no início ─────
  while (r.s.head && r.get(r.s.head).value === k) {
    const h = r.s.head;
    r.add(5, "`li->ini != NULL && li->ini->valor == k`? `3 == 3`? **Sim**: o primeiro nó precisa sair.", {}, {}, { [h]: "visitando" });

    r.get(h).state = "removido"; // fica vermelho daqui para frente
    r.add(7, "`lixo = li->ini`: guardamos o nó que vai sair, para poder liberá-lo depois.", { lixo: h });

    r.s.head = r.get(h).next;
    r.add(8, "`li->ini = li->ini->prox`: o `ini` pula o primeiro nó e passa a apontar para o segundo.", { lixo: h });

    r.removeNode(h);
    r.compact();
    r.add(9, "`free(lixo)`: o nó é liberado da memória. 🗑️");
  }

  const first = r.s.head!;
  r.add(5, `\`li->ini->valor == k\`? \`${r.get(first).value} == 3\`? **Não**. Terminou a parte 1.`, {}, {}, { [first]: "visitando" });
  r.add(12, "`li->ini == NULL`? Não, ainda há nós. Seguimos para a parte 2.");

  // ───── 2) meio e fim ─────
  let ant = first;
  r.add(18, "`ant = li->ini`: o `ant` vai ficar sempre **um nó antes** do que estamos examinando.", { ant }, {}, { [ant]: "visitando" });

  while (r.get(ant).next) {
    const nx = r.get(ant).next!;
    const v = r.get(nx).value;
    const hit = v === k;

    r.add(20, "`ant->prox != NULL`? Sim: ainda há um nó à frente para examinar.", { ant });
    r.add(22, `\`ant->prox->valor == k\`? \`${v} == 3\`? ${hit ? "**Sim**: esse nó precisa sair." : "Não: esse nó fica."}`,
      { ant }, {}, { [nx]: "visitando" });

    if (hit) {
      r.get(nx).state = "removido";
      r.add(24, "`lixo = ant->prox`: guardamos o nó que vai sair.", { ant, lixo: nx });

      r.get(ant).next = r.get(nx).next;
      r.add(25, "`ant->prox = lixo->prox`: o `ant` **pula** o nó. Repare que o `ant` **não anda**: o novo vizinho também pode ser um 3!",
        { ant, lixo: nx });

      r.removeNode(nx);
      r.compact();
      r.add(26, "`free(lixo)`: o nó é liberado. 🗑️", { ant });
    } else {
      ant = nx;
      r.add(30, "`ant = ant->prox`: **só aqui** o `ant` anda, porque não removemos nada.", { ant }, {}, { [ant]: "visitando" });
    }
  }

  r.add(20, "`ant->prox != NULL`? **Não**: chegamos ao fim da lista.", { ant });
  r.add(33, "Fim: a lista ficou [5, 8]. Cada nó foi examinado **uma vez só**: `Θ(n)`. ✅");

  return r.frames;
}

export const removerChave: Sim = {
  title: "removerChave",
  code: String.raw`// remove todos os nós com valor k, em uma única passada
void removerChave(Lista *li, int k)
{
    // 1) remove as ocorrências do início
    while (li->ini != NULL && li->ini->valor == k)
    {
        No *lixo = li->ini;
        li->ini = li->ini->prox;
        free(lixo);
    }

    if (li->ini == NULL)
    {
        return; // a lista ficou vazia
    }

    // 2) remove as ocorrências do meio e do fim
    No *ant = li->ini;

    while (ant->prox != NULL)
    {
        if (ant->prox->valor == k)
        {
            No *lixo = ant->prox;
            ant->prox = lixo->prox; // pula o nó
            free(lixo);
        }
        else
        {
            ant = ant->prox; // só anda se NÃO removeu
        }
    }
}`,
  frames: build(),
};
