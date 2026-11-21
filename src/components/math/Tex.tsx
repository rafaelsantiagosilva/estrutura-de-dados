import { useMemo } from "react";
import katex from "katex";

type Props = { tex: string; block?: boolean };

// Renderiza uma fórmula LaTeX. `block` = centralizada, em linha própria.
export default function Tex({ tex, block = false }: Props) {
  const html = useMemo(
    () => katex.renderToString(tex, { displayMode: block, throwOnError: false }),
    [tex, block],
  );
  return (
    <span
      className={block ? "block overflow-x-auto py-1" : undefined}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}