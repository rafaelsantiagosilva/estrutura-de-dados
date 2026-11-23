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
import { filaListaNew, filaListaAddVazia, filaListaAdd, filaListaRemover, filaListaRemoverUnico, filaListaRemoverVazia, filaListaPrint, filaListaProdutorConsumidor, filaListaPrioridade } from "./fila/fila-lista";
import { filaVetorLinear, filaVetorCircular, filaVetorSize, filaVetorCheia } from "./fila/fila-vetor";
import { lacoLog } from "./notacao-assintotica/laco-log";
import { indiceLinear } from "./tempo-de-execucao/indice-linear";
import { buscaSeqLista, makeBuscaSeq, makeBuscaBin } from "./buscas";
import { mergeIntercala, makeMergeTree, VETOR_MERGE, quickParticao, makeQuickTree, VETOR_QUICK } from "./nlogn";

// Chave = o que você escreve em <Sim name="..." /> no MDX
export const sims: Record<string, AnySim> = {
    // notacao assintotica
    lacoLog,
    // tempo de execucao
    indiceLinear,
    // listas
    newNo, newLista, estaVazia, size, printLista,
    addInicio, addFim, get, set, remover, add, busca, addOrdenado,
    addTrocado, inverter, concatenar, removerChave, tipoB, buscaLenta, ordenaLista,
    circAddFim, circRemover, dblAdd, dblRemover, vetInserir, vetRemover,
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
    // fila com lista
    filaListaNew,
    filaListaAddVazia,
    filaListaAdd,
    filaListaRemover,
    filaListaRemoverUnico,
    filaListaRemoverVazia,
    filaListaPrint,
    filaListaProdutorConsumidor,
    filaListaPrioridade,
    // fila com vetor
    filaVetorLinear,
    filaVetorCircular,
    filaVetorSize,
    filaVetorCheia,
    // buscas
    buscaSeqLista,
    buscaSeq: makeBuscaSeq(5),
    buscaSeqAusente: makeBuscaSeq(7),
    buscaBin: makeBuscaBin(3),
    buscaBinAchou: makeBuscaBin(12),
    // ordenacao
    selecao, bolha, insercaoA, insercaoIte,
    // ordenação O(n lg n)
    mergeIntercala,
    mergeArvore: makeMergeTree(VETOR_MERGE),
    quickParticao,
    quickArvore: makeQuickTree(VETOR_QUICK),
};