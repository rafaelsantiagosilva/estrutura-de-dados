import type { AnySim } from "./types";
import { newNo } from "./listas-ligadas/newNo";
import { newLista } from "./listas-ligadas/newLista";
import { estaVazia } from "./listas-ligadas/estaVazia";
import { size } from "./listas-ligadas/size";
import { printLista } from "./listas-ligadas/printLista";
import { addInicio } from "./listas-ligadas/addInicio";
import { addFim } from "./listas-ligadas/addFim";
import { get } from "./listas-ligadas/get";
import { set } from "./listas-ligadas/set";
import { remover } from "./listas-ligadas/remover";
import { add } from "./listas-ligadas/add";
import { busca } from "./listas-ligadas/busca";
import { addOrdenado } from "./listas-ligadas/addOrdenado";

// Chave = o que você escreve em <Sim name="..." /> no MDX
export const sims: Record<string, AnySim> = {
    // listas
    newNo, newLista, estaVazia, size, printLista,
    addInicio, addFim, get, set, remover, add, busca, addOrdenado,
};