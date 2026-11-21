import { useEffect, useRef, useState } from "react";
import { getHighlighter } from "../../lib/highlighter";

type Props = { code: string; activeLine?: number };

export default function CodePanel({ code, activeLine }: Props) {
  const [html, setHtml] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // 1) colore o código (assíncrono: o highlighter carrega sob demanda)
  useEffect(() => {
    let cancelled = false;
    getHighlighter().then((h) => {
      if (!cancelled) setHtml(h.codeToHtml(code, { lang: "c", theme: "ink-blue" }));
    });
    return () => { cancelled = true; };
  }, [code]);

  // 2) marca a linha ativa (cada linha do Shiki é um <span class="line">)
  useEffect(() => {
    ref.current?.querySelectorAll<HTMLElement>(".line").forEach((el, idx) => {
      if (idx + 1 === activeLine) el.setAttribute("data-active", "");
      else el.removeAttribute("data-active");
    });
  }, [html, activeLine]);

  return (
    <>
      {/* enquanto o Shiki não carrega, mostra o código sem cor */}
      {!html && (
        <pre className="m-0 overflow-x-auto border-0 p-4 font-mono text-sm text-ink-400">{code}</pre>
      )}
      <div ref={ref} className="sim-code overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}