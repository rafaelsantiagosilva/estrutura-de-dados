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
import { bolha } from "./ordenacao/bolha";
import { insercaoA, insercaoIte } from "./ordenacao/insercao";
import { selecao } from "./ordenacao/selecao";
import { pilhaVetorPush, pilhaVetorPop, pilhaVetorNew, pilhaVetorCheia, pilhaVetorVazia, pilhaVetorPrint, pilhaVetorBalanceado, pilhaVetorDesbalanceadoVazia, pilhaVetorDesbalanceadoSobra } from "./pilha/pilha-vetor";
import { addTrocado } from "./listas-ligadas/addTrocado";
import { buscaLenta } from "./listas-ligadas/buscaLenta";
import { concatenar } from "./listas-ligadas/concatenar";
import { inverter } from "./listas-ligadas/inverter";
import { circAddFim, circRemover } from "./listas-ligadas/listaCircular";
import { dblAdd, dblRemover } from "./listas-ligadas/listaDupla";
import { ordenaLista } from "./listas-ligadas/ordenaLista";
import { removerChave } from "./listas-ligadas/removerChave";
import { tipoB } from "./listas-ligadas/tipoB";
import { vetInserir, vetRemover } from "./listas-ligadas/vetorLista";
import { pilhaListaNo, pilhaListaNew, pilhaListaPush, pilhaListaPop, pilhaListaPopVazia, pilhaListaPrint, pilhaListaSize, pilhaListaSizeRec, pilhaListaBalanceado, pilhaListaPushRef } from "./pilha/pilha-lista";

// Chave = o que você escreve em <Sim name="..." /> no MDX
export const sims: Record<string, AnySim> = {
    // listas
    newNo, newLista, estaVazia, size, printLista,
    addInicio, addFim, get, set, remover, add, busca, addOrdenado,
    addTrocado, inverter, concatenar, removerChave, tipoB, buscaLenta, ordenaLista,
    circAddFim, circRemover, dblAdd, dblRemover, vetInserir, vetRemover,
    // ordenacao
    selecao, bolha, insercaoA, insercaoIte,
    // pilha com vetor
    pilhaVetorPush,
    pilhaVetorPop,
    pilhaVetorNew,
    pilhaVetorCheia,
    pilhaVetorVazia,
    pilhaVetorPrint,
    pilhaVetorBalanceado,
    pilhaVetorDesbalanceadoVazia,
    pilhaVetorDesbalanceadoSobra,
    // pilha com lista
    pilhaListaNo,
    pilhaListaNew,
    pilhaListaPush,
    pilhaListaPop,
    pilhaListaPopVazia,
    pilhaListaPrint,
    pilhaListaSize,
    pilhaListaSizeRec,
    pilhaListaBalanceado,
    pilhaListaPushRef,
};