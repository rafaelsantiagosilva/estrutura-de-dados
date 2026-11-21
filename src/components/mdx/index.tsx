import type { MDXComponents } from "mdx/types";
import Callout from "./Callout";
import Pre from "./Pre";
import Table from "./Table";
import ComplexityBadge from "./ComplexityBadge";

export const mdxComponents: MDXComponents = {
  // 🔁 Troca de elementos HTML do Markdown pelos nossos componentes
  blockquote: Callout,
  pre: Pre,
  table: Table,

  // 🧱 Componentes que podem ser usados direto no .mdx, sem import
  ComplexityBadge,
};