import type { MDXComponents } from "mdx/types";
import Callout from "./Callout";
import Pre from "./Pre";
import Table from "./Table";
import ComplexityBadge from "./ComplexityBadge";
import Sim from "../viz/Sim";

export const mdxComponents: MDXComponents = {
  blockquote: Callout,
  pre: Pre,
  table: Table,

  // usáveis direto no .mdx, sem import
  ComplexityBadge,
  Sim,
};