import type { Marks } from "./listRecorder";
import type { Sim } from "./types";
import { createListRecorder } from "./listRecorder";

function build() {
  // colunas fixas: os nós ficam parados e só as SETAS viram
  const r = createListRecorder([3, 4, 9, 1], { fixed: true }); // a b c d

  // as 3 variáveis do exercício (só aparecem depois de declaradas/atribuídas)
  const shown = new Set<string>();
  let anterior: string | null = null;
  let atual: string | null = null;
  let proximo: string | null = null;
  const virados = new Set<string>();

  const snap = (line: number, caption: string) => {
    const ptrs: Record<string, string | null> = {};
    const vars: Record<string, string> = {};
    for (const [name, id] of Object.entries({ anterior, atual, proximo })) {
      if (!shown.has(name)) continue;
      vars[name] = r.label(id);           // chip: "NULL" ou "nó 3"
      if (id !== null) ptrs[name] = id;   // rótulo no desenho
    }
    const marks: Marks = {};
    virados.forEach((id) => (marks[id] = "achado"));
    if (atual) marks[atual] = "visitando";
    r.add(line, caption, ptrs, vars, marks);
  };

  r.add(2, "`inverter(li)` na lista [3, 4, 9, 1]. Os nós **não vão mudar de lugar**: só as setas vão virar. 🔄");

  anterior = null; shown.add("anterior");
  snap(4, "`anterior = NULL`: ainda não existe nó antes do primeiro.");

  atual = r.s.head; shown.add("atual");
  snap(5, "`atual = li->ini`: começamos pelo primeiro nó. (O `proximo` é declarado na linha 6, mas só ganha valor depois.)");

  snap(8, "`atual != NULL`? Sim, há nós para virar. Entramos no laço.");

  while (atual !== null) {
    const cur: string = atual;
    const v = r.get(cur).value;

    proximo = r.get(cur).next; shown.add("proximo");
    snap(10, proximo
      ? `\`proximo = atual->prox\`: guardamos o resto da lista (a partir do ${r.get(proximo).value}). Sem isso, perderíamos ele no próximo passo!`
      : "`proximo = atual->prox`: aqui é `NULL`, o 1 era o último nó.");

    r.get(cur).next = anterior;
    snap(11, anterior
      ? `\`atual->prox = anterior\`: a seta do ${v} agora aponta **para trás**, para o ${r.get(anterior).value}. 🔄`
      : `\`atual->prox = anterior\`: o ${v} passa a apontar para \`NULL\`: ele vai ser o **último** nó da lista invertida.`);

    anterior = cur; virados.add(cur);
    snap(12, `\`anterior = atual\`: o \`anterior\` anda para o nó que acabamos de virar (o ${v}).`);

    atual = proximo;
    snap(13, atual
      ? `\`atual = proximo\`: o \`atual\` anda para o ${r.get(atual).value}. Repete o processo.`
      : "`atual = proximo`: o `atual` vale `NULL`. Não há mais nós para virar.");
  }

  snap(8, "`atual != NULL`? **Não.** O laço termina.");

  r.s.head = anterior;
  snap(16, "`li->ini = anterior`: o `ini` passa a apontar para o antigo último nó (o 1). ✅");

  r.unfix(); // o desenho se reorganiza na ordem nova
  snap(17, "Fim: a lista agora é [1, 9, 4, 3]. Só mexemos em ponteiros: nenhum nó foi criado nem destruído.");

  return r.frames;
}

export const inverter: Sim = {
  title: "inverter",
  code: String.raw`// inverte a lista usando só 3 apontadores
void inverter(Lista *li)
{
    No *anterior = NULL;
    No *atual = li->ini;
    No *proximo;

    while (atual != NULL)
    {
        proximo = atual->prox;   // 1) guarda o resto da lista
        atual->prox = anterior;  // 2) vira a seta para trás
        anterior = atual;        // 3) anda com o anterior
        atual = proximo;         // 4) anda com o atual
    }

    li->ini = anterior;          // o último nó vira o primeiro
}`,
  frames: build(),
};
