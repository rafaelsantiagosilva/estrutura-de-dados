import type { Marks } from "./listRecorder";
import type { Sim } from "./types";
import { createListRecorder } from "./listRecorder";

function build() {
  // lista original na linha principal; lista ordenada na linha de cima
  const r = createListRecorder([5, 2, 8, 6], { fixed: true }); // a b c d
  let ordenada: string | null = null;
  let declarada = false;

  const num = (id: string) => r.get(id).value as number;

  // cada lista volta a ocupar colunas 0, 1, 2... (só chamamos quando o nó solto já entrou na ordenada)
  const reflow = () => {
    r.place(r.chainOf(ordenada), "top");
    r.place(r.chainOf(r.s.head), "main");
  };

  const snap = (line: number, caption: string, ptrs: Record<string, string | null> = {}, marks: Marks = {}) => {
    const p = ordenada ? { ordenada, ...ptrs } : ptrs;
    r.add(line, caption, p, declarada ? { ordenada: r.label(ordenada) } : {}, marks);
  };

  r.add(2, "`ordenaLista(li)` na lista [5, 2, 8, 6]. Vamos **mover os nós** (sem criar nenhum) da `li` para uma lista nova, sempre na posição certa.");

  declarada = true;
  snap(4, "`ordenada = NULL`: a lista ordenada começa vazia. Ela vai aparecer **na linha de cima**.");

  let primeira = true;
  while (r.s.head) {
    const no = r.s.head;
    const v = num(no);
    const novo: Marks = { [no]: "novo" };

    if (primeira) {
      snap(6, "`li->ini != NULL`? Sim, ainda há nós na lista original. Entramos no laço.");
      primeira = false;
    }
    snap(9, `\`no = li->ini\`: pegamos o primeiro nó da lista original (o ${v}).`, { no }, novo);

    r.s.head = r.get(no).next;
    snap(10, "`li->ini = no->prox`: a lista original **pula** esse nó. Agora o `no` está solto, esperando para ser encaixado.", { no }, novo);

    const vazia = ordenada === null;
    const entraNoComeco = vazia || v <= num(ordenada!);
    snap(13, vazia
      ? "`ordenada == NULL`? Sim: a lista ordenada está vazia, então o nó entra no começo."
      : `\`no->valor <= ordenada->valor\`? \`${v} <= ${num(ordenada!)}\`? ${entraNoComeco ? "**Sim**: entra no começo." : "Não: vamos procurar o lugar dele."}`,
      { no }, novo);

    if (entraNoComeco) {
      r.get(no).next = ordenada;
      snap(15, "`no->prox = ordenada`: o nó aponta para o antigo primeiro da lista ordenada.", { no }, novo);

      ordenada = no;
      reflow();
      snap(16, "`ordenada = no`: o nó é o novo primeiro da lista ordenada. ✅ (Ele subiu no desenho, e a lista original fechou o espaço.)", { no }, novo);
    } else {
      let aux = ordenada!;
      snap(20, "`aux = ordenada`: vamos andar na lista ordenada procurando o lugar do nó.", { no, aux }, { ...novo, [aux]: "visitando" });

      while (true) {
        const prox: string | null = r.get(aux).next;
        const anda = prox !== null && num(prox) < v;
        snap(22, prox === null
          ? "`aux->prox != NULL`? Não: chegamos ao fim da lista ordenada. Para."
          : `\`aux->prox->valor < no->valor\`? \`${num(prox)} < ${v}\`? ${anda ? "**Sim**: o nó vem depois dele. Continua andando." : "Não: o lugar é **logo depois do `aux`**. Para."}`,
          { no, aux }, { ...novo, [aux]: "visitando" });
        if (!anda) break;

        aux = prox!;
        snap(24, "`aux = aux->prox`: andamos um nó na lista ordenada.", { no, aux }, { ...novo, [aux]: "visitando" });
      }

      r.get(no).next = r.get(aux).next;
      snap(27, "**1º passo:** `no->prox = aux->prox`: o nó segura o resto da lista ordenada.", { no, aux }, { ...novo, [aux]: "visitando" });

      r.get(aux).next = no;
      reflow();
      snap(28, "**2º passo:** `aux->prox = no`: o `aux` passa a apontar para o nó. Encaixado! ✅", { no, aux }, { ...novo, [aux]: "visitando" });
    }
  }

  snap(6, "`li->ini != NULL`? **Não**: a lista original esvaziou, todos os nós já estão na lista ordenada.");

  r.s.head = ordenada;
  snap(32, "`li->ini = ordenada`: a `li` passa a apontar para a lista ordenada. ✅");

  r.place(r.chainOf(r.s.head), "main");
  r.add(33, "Fim: a lista é [2, 5, 6, 8]. Nenhum nó foi criado nem destruído: só mudamos ponteiros.");

  return r.frames;
}

export const ordenaLista: Sim = {
  title: "ordenaLista",
  code: String.raw`// ordena a lista reaproveitando os nós (não cria nem destrói nenhum)
void ordenaLista(Lista *li)
{
    No *ordenada = NULL; // início da nova lista, já ordenada

    while (li->ini != NULL)
    {
        // 1) tira o primeiro nó da lista original
        No *no = li->ini;
        li->ini = no->prox;

        // 2) encaixa o nó na lista ordenada
        if (ordenada == NULL || no->valor <= ordenada->valor)
        {
            no->prox = ordenada;
            ordenada = no;
        }
        else
        {
            No *aux = ordenada;

            while (aux->prox != NULL && aux->prox->valor < no->valor)
            {
                aux = aux->prox;
            }

            no->prox = aux->prox;
            aux->prox = no;
        }
    }

    li->ini = ordenada; // a lista original passa a ser a ordenada
}`,
  frames: build(),
};
