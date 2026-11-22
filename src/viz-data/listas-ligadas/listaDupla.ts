import type { Sim } from "./types";
import { createListRecorder } from "./listRecorder";

/* ───────── add (Questão 75) ───────── */

function buildAdd() {
  // duplamente ligada e circular: a ⇄ b ⇄ c ⇄ d ⇄ (volta para a)
  const r = createListRecorder([8, 5, 9, 3], { circular: true, doubly: true });
  const vars = { valor: 7 };

  r.add(1, "`add(li, 7)` em uma lista duplamente ligada **circular** [8, 5, 9, 3]. Seta sólida = `prox`, seta tracejada = `prev`.", {}, vars);

  r.addNode("n", 7, "novo");
  r.add(3, "`newNo(7)` cria o nó solto, com `prox` e `prev` valendo `NULL`.", { no: "n" }, vars);

  r.add(5, "`li->ini == NULL`? Não, a lista tem nós. Vamos para o `else`: o novo nó será inserido **logo depois do `ini`**.", { no: "n" });

  r.get("n").next = "b";
  r.add(13, "**Passo 1:** `no->prox = li->ini->prox`. O novo nó aponta para o 5 (quem vem depois do `ini`).", { no: "n" }, {}, { a: "visitando", b: "visitando" });

  r.get("n").prev = "a";
  r.add(14, "**Passo 2:** `no->prev = li->ini`. O novo nó aponta de volta para o 8.", { no: "n" }, {}, { a: "visitando", b: "visitando" });

  r.get("b").prev = "n";
  r.add(15, "**Passo 3:** `li->ini->prox->prev = no`. O 5 (que ainda é o `ini->prox`) passa a ter o novo nó como `prev`.", { no: "n" }, {}, { a: "visitando", b: "visitando" });

  r.get("a").next = "n";
  r.add(16, "**Passo 4:** `li->ini->prox = no`. Agora sim o 8 aponta para o novo nó. Ele entrou na lista nos dois sentidos! ✅", { no: "n" }, {}, { a: "visitando", b: "visitando" });

  r.add(18, "Fim: a lista é [8, 7, 5, 9, 3]. Repare na **ordem**: o passo 3 precisa vir **antes** do 4, senão `li->ini->prox` já seria o próprio `no`.");
  return r.frames;
}

export const dblAdd: Sim = {
  title: "add (duplamente ligada)",
  circular: true,
  doubly: true,
  code: String.raw`void add(Lista *li, int valor)
{
    No *no = newNo(valor);

    if (li->ini == NULL)
    {
        li->ini = no;
        no->prox = no;
        no->prev = no;
    }
    else
    {
        no->prox = li->ini->prox;
        no->prev = li->ini;
        li->ini->prox->prev = no;
        li->ini->prox = no;
    }
}`,
  frames: buildAdd(),
};

/* ───────── remover um nó (Questão 76) ───────── */

function buildRemover() {
  const r = createListRecorder([8, 5, 9, 3], { fixed: true, circular: true, doubly: true }); // a b c d

  r.add(2, "`removerNo(li, no)`: o ponteiro `no` já aponta para o nó que será removido (o 9). **Não precisamos procurar o anterior**: o próprio nó sabe quem é.",
    { no: "c" }, {}, { c: "visitando" });

  r.add(4, "`no->prox == no`? Não: a lista tem vários nós (o caso do nó único é o `if`).", { no: "c" }, {}, { c: "visitando" });

  r.get("c").state = "removido";
  r.get("b").next = "d";
  r.add(10, "**Passo 1:** `no->prev->prox = no->prox`. O 5 (o `prev` do 9) passa a apontar direto para o 3, **pulando** o 9.", { no: "c" });

  r.get("d").prev = "b";
  r.add(11, "**Passo 2:** `no->prox->prev = no->prev`. O 3 (o `prox` do 9) passa a apontar de volta para o 5. O 9 ficou fora da lista nos dois sentidos.", { no: "c" });

  r.add(13, "`li->ini == no`? Não: o `ini` é o 8, então não precisamos mexer nele. (Se fosse, o `ini` teria que ir para `no->prox`.)", { no: "c" });

  r.add(19, "`valor = no->valor`: guardamos o 9 antes de liberar o nó.", { no: "c" }, { valor: 9 });

  r.removeNode("c");
  r.compact();
  r.add(20, "`free(no)`: o nó é liberado da memória. 🗑️");

  r.add(21, "`return valor`: devolve o 9. A lista é [8, 5, 3]. Nenhuma busca foi necessária: custo `Θ(1)`. ✅", {}, { retorno: 9 });
  return r.frames;
}

export const dblRemover: Sim = {
  title: "removerNo (duplamente ligada)",
  circular: true,
  doubly: true,
  code: String.raw`// remove o nó apontado por no (lista duplamente ligada e circular)
int removerNo(Lista *li, No *no)
{
    if (no->prox == no)
    {
        li->ini = NULL; // era o único nó
    }
    else
    {
        no->prev->prox = no->prox; // o anterior pula o nó
        no->prox->prev = no->prev; // o próximo volta direto para o anterior

        if (li->ini == no)
        {
            li->ini = no->prox;    // removemos o primeiro: o segundo assume
        }
    }

    int valor = no->valor;
    free(no);
    return valor;
}`,
  frames: buildRemover(),
};
