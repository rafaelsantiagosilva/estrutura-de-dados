import type { MDXComponents } from "mdx/types";
import Callout from "./Callout";
import Pre from "./Pre";
import Table from "./Table";
import ComplexityBadge from "./ComplexityBadge";
import Sim from "../viz/Sim";
import Tex from "../math/Tex";
import Derivation from "../math/Derivation";
import CostTable from "../math/CostTable";
import GrowthChart from "../viz/GrowthChart";
import BigOExplorer from "../viz/BigOExplorer";
import { Exercicio, Resposta } from "./Exercicio";
import BuscaLab from "../viz/BuscaLab";
import CompareSteps from "../viz/CompareSteps";
import Grafo from "../viz/Grafo";
import TreeLab from "../viz/TreeLab";

export const mdxComponents: MDXComponents = {
  blockquote: Callout,
  pre: Pre,
  table: Table,

  // usáveis direto no .mdx, sem import
  ComplexityBadge,
  Sim,
  Tex,
  Derivation,
  CostTable,
  GrowthChart,
  BigOExplorer,
  Exercicio,
  Resposta,
  BuscaLab,
  CompareSteps,
  Grafo,
  TreeLab
};