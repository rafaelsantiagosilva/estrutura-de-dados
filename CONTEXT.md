# 📘 CONTEXT.md: Site de Estruturas de Dados

## 1. O que é
Site no estilo "documentação" para uma aula de Estruturas de Dados em C.
Público: alunos iniciantes. Idioma: **pt-BR**. Tom: didático, emojis moderados.
Cada tema (ex.: Listas Encadeadas) tem abas: Explicação, Complexidades, Exercícios.

## 2. Stack (⚠️ confirme com `npm ls react vite tailwindcss react-router-dom motion shiki`)
React __ + Vite __ + TypeScript · Tailwind CSS v4 (tokens em `@theme`, sem tailwind.config)
react-router-dom __ · MDX (@mdx-js/rollup, remark-gfm, remark-math, rehype-katex, rehype-pretty-code)
Shiki (tema próprio) · motion (`import { motion } from "motion/react"`) · lucide-react · Radix Collapsible · KaTeX

## 3. Arquitetura
main.tsx → App.tsx (rotas) → DocLayout (TopBar + Sidebar + <Outlet/>) → DocPage
DocPage carrega `src/content/<tema>/<aba>.mdx` via `import.meta.glob` (um `lazy` por arquivo, em cache).
`src/lib/nav.ts` é a fonte única dos temas/abas (sidebar, abas, home e Anterior/Próximo leem dele).
`src/components/mdx/index.tsx` mapeia: blockquote→Callout, pre→Pre, table→Table e registra
componentes usáveis no MDX sem import: ComplexityBadge, Sim (⚠️ atualize a lista).

## 4. Pastas
src/content/<tema>/{explicacao,complexidades,exercicios}.mdx
src/components/{layout,mdx,viz,math}/
src/viz-data/   → dados das simulações (1 arquivo por função) + index.ts (registro)
src/lib/        → nav.ts, code-theme.ts, highlighter.ts

## 5. Design system "Ink & Blue"
Só use tokens (ex.: `bg-ink-900`, `text-brand-400`, `border-ink-600`, `text-ok/warn/danger`).
NUNCA coloque hex direto em componentes (exceção: cores de curvas em gráficos SVG).
Títulos e código: `font-mono` (JetBrains Mono). Texto corrido: Inter. Raio: `rounded-card`.
Cores funcionais: verde=novo/achado, amarelo=visitando/aux, vermelho=removido.

## 6. Motor de simulações
Sim = { title, code, frames }. Frame = { nodes, head, ptrs?, vars?, line?, caption }.
- `line` = nº da linha DENTRO de `code` (começa em 1)
- `ptrs: { aux: null }` = aponta para NULL (não omita a chave)
- nó novo usa id "n"; helpers: makeList, patch, mark
- Legenda aceita `crases` (viram <code>)
Uso no MDX: `<Sim name="addInicio" />` (substitui o bloco de código estático da função)

## 7. Armadilhas conhecidas
- Em .mdx, `{` e `<` fora de crases/blocos de código quebram a compilação.
- Criou um .mdx novo? Reinicie `npm run dev` (o glob não enxerga na hora).
- `@theme static` é necessário para as variáveis usadas só dentro de SVG.
- Ids de SVG: usar `useId().replace(/:/g, "")`.
- Em props de componentes dentro do MDX, backslash de LaTeX precisa ser dobrado: "\\Theta".

## 8. Estado atual (⚠️ atualize a cada etapa)
- [x] Layout, rotas, sidebar, MDX, tema de código
- [x] Simulações de Listas: todas as 13 funções
- [ ] Gráficos e cálculos (notação assintótica / tempo de execução)
- [ ] Pilhas e filas (vetor e lista)
- [ ] Ordenação, buscas, grafos, árvores

## 9. Como me responder
- Entregue **arquivos completos** (não trechos), com o caminho no topo de cada bloco.
- Liste ao final quais arquivos foram criados/alterados.
- Não instale bibliotecas novas sem perguntar. Não reescreva o que não foi pedido.
- Se faltar algum arquivo para fazer direito, peça antes de chutar.