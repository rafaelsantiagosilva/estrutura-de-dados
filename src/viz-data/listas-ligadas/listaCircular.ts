import type { Sim } from "./types";
import { createListRecorder } from "./listRecorder";

/* ───────── addFim em lista circular ───────── */

function buildAddFim() {
  const r = createListRecorder([8, 5, 9], { circular: true }); // a → b → c → (volta para a)
  const vars = { valor: 3 };

  r.add(1, "`addFim(li, 3)` em uma lista **circular** [8, 5, 9]: o último nó (9) aponta de volta para o primeiro.", {}, vars);

  r.addNode("n", 3, "novo");
  r.add(3, "`newNo(3)` cria o nó solto (com `prox = NULL`, como sempre).", { no: "n" }, vars);

  r.add(5, "`li->ini == NULL`? Não, a lista tem nós. Vamos para o `else`.", { no: "n" });

  r.add(12, "`aux = li->ini`: começamos no primeiro nó.", { no: "n", aux: "a" }, {}, { a: "visitando" });
  r.add(15, "`aux->prox != li->ini`? O `prox` do 8 é o 5, que **não** é o `ini`. Continua.", { no: "n", aux: "a" }, {}, { a: "visitando" });
  r.add(17, "`aux = aux->prox`: andamos um nó.", { no: "n", aux: "b" }, {}, { b: "visitando" });
  r.add(15, "`aux->prox != li->ini`? O `prox` do 5 é o 9, que também **não** é o `ini`. Continua.", { no: "n", aux: "b" }, {}, { b: "visitando" });
  r.add(17, "`aux = aux->prox`: andamos mais um.", { no: "n", aux: "c" }, {}, { c: "visitando" });
  r.add(15, "`aux->prox != li->ini`? O `prox` do 9 **é** o `ini`! Achamos o último nó. O laço termina. (Aqui não existe `NULL` para nos avisar: o critério é voltar ao início.)",
    { no: "n", aux: "c" }, {}, { c: "visitando" });

  r.get("c").next = "n";
  r.add(20, "`aux->prox = no`: o último nó passa a apontar para o novo. Por um instante a lista está **aberta** (o novo ainda aponta para `NULL`).",
    { no: "n", aux: "c" }, {}, { c: "visitando" });

  r.get("n").next = "a";
  r.add(21, "`no->prox = li->ini`: o novo nó **fecha o círculo**, apontando para o primeiro. ✅", { no: "n", aux: "c" }, {}, { c: "visitando" });

  r.add(23, "Fim: a lista circular é [8, 5, 9, 3]. Achar o último custa `Θ(n)`.");
  return r.frames;
}

export const circAddFim: Sim = {
  title: "addFim (circular)",
  circular: true,
  code: String.raw`void addFim(Lista *li, int valor)
{
    No *no = newNo(valor);

    if (li->ini == NULL)
    {
        li->ini = no;
        no->prox = no; // aponta para si mesmo
    }
    else
    {
        No *aux = li->ini;

        // anda até o último nó: o que aponta de volta para o início
        while (aux->prox != li->ini)
        {
            aux = aux->prox;
        }

        aux->prox = no;     // o último aponta para o novo
        no->prox = li->ini; // o novo fecha o círculo
    }
}`,
  frames: buildAddFim(),
};

/* ───────── remover o primeiro nó de uma lista circular ───────── */

function buildRemover() {
  const r = createListRecorder([8, 5, 9, 3], { circular: true }); // a b c d → (volta para a)

  r.add(1, "`remover(li, 0)` em uma lista circular [8, 5, 9, 3]: vamos tirar o **primeiro** nó.", { }, { idx: 0 });
  r.add(3, "`idx < 0 || idx >= size(li)`? `0 >= 4`? Não: o índice é válido. (Numa lista circular não existe `NULL` para avisar que passamos do fim, por isso conferimos o `size`.)");
  r.add(11, "`idx == 0`? Sim: removemos o primeiro nó.");

  r.add(13, "`no = li->ini`: guardamos o nó que vai sair (o 8).", { no: "a" }, {}, { a: "removido" });
  r.get("a").state = "removido";

  r.add(15, "`no->prox == no`? Não: a lista tem mais de um nó, então não é o caso do nó único.", { no: "a" });

  r.add(21, "`ultimo = get(li, size(li) - 1)`: precisamos do **último** nó, porque ele aponta para o primeiro e vai ter que apontar para outro. Achá-lo custa `Θ(n)`.",
    { no: "a", ultimo: "d" });

  r.get("d").next = "b";
  r.add(22, "`ultimo->prox = no->prox`: o último nó passa a apontar para o **segundo** (o 5). O círculo já não passa pelo 8.",
    { no: "a", ultimo: "d" });

  r.s.head = "b";
  r.add(23, "`li->ini = no->prox`: o `ini` passa a apontar para o segundo nó. O 8 ficou solto: ninguém mais aponta para ele.",
    { no: "a", ultimo: "d" });

  r.add(33, "`valor = no->valor`: guardamos o 8 antes de liberar o nó.", { no: "a" }, { valor: 8 });

  r.removeNode("a");
  r.add(34, "`free(no)`: o nó é liberado da memória. 🗑️");

  r.add(35, "`return valor`: devolve o 8. A lista circular agora é [5, 9, 3].", {}, { retorno: 8 });
  return r.frames;
}

export const circRemover: Sim = {
  title: "remover (circular)",
  circular: true,
  code: String.raw`int remover(Lista *li, int idx)
{
    if (idx < 0 || idx >= size(li))
    {
        printf("Fora dos limites\n");
        exit(1);
    }

    No *no;

    if (idx == 0)
    {
        no = li->ini;

        if (no->prox == no)
        {
            li->ini = NULL; // era o único nó
        }
        else
        {
            No *ultimo = get(li, size(li) - 1);
            ultimo->prox = no->prox; // o último pula o primeiro
            li->ini = no->prox;      // o segundo vira o primeiro
        }
    }
    else
    {
        No *anterior = get(li, idx - 1);
        no = anterior->prox;
        anterior->prox = no->prox;
    }

    int valor = no->valor;
    free(no);
    return valor;
}`,
  frames: buildRemover(),
};
