import type { Sim } from "../types";
import { createListRecorder } from "./listRecorder";

function build() {
  // li1 = [3, 4] nas colunas 0 e 1; li2 = [9, 1] nas colunas 3 e 4 (com um espaço no meio)
  const r = createListRecorder([3, 4, 9, 1], { fixed: true }); // a b | c d
  r.get("b").next = null;
  r.get("c").col = 3;
  r.get("d").col = 4;

  const li2 = { "li2->ini": "c" };

  r.add(2, "`concatenar(li1, li2)`: `li1 = [3, 4]` (a caixa `ini`) e `li2 = [9, 1]` (rótulo `li2->ini`). Vamos pendurar a `li2` no fim da `li1`.", li2);
  r.add(4, "`estaVazia(li2)`? Não, ela tem nós. Seguimos.", li2);
  r.add(9, "`estaVazia(li1)`? Também não. Vamos para o `else`: precisamos achar o **último nó** da `li1`.", li2);

  r.add(15, "`aux = li1->ini`: começamos no primeiro nó da `li1`.", { ...li2, aux: "a" }, {}, { a: "visitando" });
  r.add(17, "`aux->prox != NULL`? Sim (o 3 aponta para o 4). Continua andando.", { ...li2, aux: "a" }, {}, { a: "visitando" });
  r.add(19, "`aux = aux->prox`: andamos um nó.", { ...li2, aux: "b" }, {}, { b: "visitando" });
  r.add(17, "`aux->prox != NULL`? **Não**: o 4 aponta para `NULL`. Achamos o último nó da `li1`.", { ...li2, aux: "b" }, {}, { b: "visitando" });

  r.get("b").next = "c";
  r.add(22, "`aux->prox = li2->ini`: o último da `li1` passa a apontar para o primeiro da `li2`. As duas listas viraram uma só! 🔗",
    { ...li2, aux: "b" }, {}, { b: "visitando" });

  r.compact(); // o desenho "fecha o buraco"
  r.add(25, "`li2->ini = NULL`: a `li2` deixa de apontar para os nós (agora eles pertencem à `li1`). O desenho só aproximou os nós: na memória nada se moveu.",
    {}, { "li2->ini": "NULL" });

  r.add(26, "Fim: `li1 = [3, 4, 9, 1]`. Só percorremos a `li1`: o custo é `Θ(n)`, com `n` = tamanho da `li1`.");

  return r.frames;
}

export const concatenar: Sim = {
  title: "concatenar",
  code: String.raw`// coloca a li2 no final da li1
void concatenar(Lista *li1, Lista *li2)
{
    if (estaVazia(li2))
    {
        return; // nada para juntar
    }

    if (estaVazia(li1))
    {
        li1->ini = li2->ini; // a li1 passa a ser a li2
    }
    else
    {
        No *aux = li1->ini;

        while (aux->prox != NULL)
        {
            aux = aux->prox;
        }

        aux->prox = li2->ini; // o último da li1 aponta para o 1º da li2
    }

    li2->ini = NULL; // a li2 não é mais dona dos nós
}`,
  frames: build(),
};
