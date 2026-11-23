import { useMemo, useState, type ReactElement } from "react";
import { motion } from "motion/react";
import type { TreeXmlSimData, XmlLine } from "../../viz-data/arvores/treeTypes";
import SimShell from "./SimShell";
import TreeCanvas from "./TreeCanvas";
import { treeDims } from "./treeLayout";

/** Para cada marca de abertura (índice), o índice da marca de fechamento correspondente (se já foi escrita). */
function matchTags(lines: XmlLine[]) {
  const match = new Map<number, number>();
  const stack: number[] = [];
  lines.forEach((l, i) => {
    if (l.kind !== "tag") return;
    if (l.text.startsWith("</")) {
      const open = stack.pop();
      if (open !== undefined) match.set(open, i);
    } else {
      stack.push(i);
    }
  });
  return match;
}

/** O "arquivo" XML. Marcas já fechadas podem ser recolhidas, como o Chrome faz ao abrir um XML. */
function XmlPane({ lines }: { lines: XmlLine[] }) {
  const [collapsed, setCollapsed] = useState<Set<number>>(() => new Set());
  const match = useMemo(() => matchTags(lines), [lines]);

  const toggle = (i: number) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const rows: ReactElement[] = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const close = match.get(i);
    const isCollapsed = close !== undefined && collapsed.has(i);
    const isNewest = i === lines.length - 1;

    rows.push(
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className={`flex items-center gap-1 rounded px-1 font-mono text-[13px] leading-6 ${isNewest ? "bg-ink-800" : ""}`}
        style={{ paddingLeft: `${l.depth * 16 + 4}px` }}
      >
        {close !== undefined ? (
          <button
            onClick={() => toggle(i)}
            aria-label={isCollapsed ? "Expandir ramo" : "Recolher ramo"}
            className="w-4 text-ink-400 hover:text-white"
          >
            {isCollapsed ? "▶" : "▼"}
          </button>
        ) : (
          <span className="w-4" />
        )}
        <span className={l.kind === "tag" ? "text-brand-300" : "text-ink-200"}>{l.text}</span>
        {isCollapsed && close !== undefined && (
          <>
            <span className="text-ink-400">…</span>
            <span className="text-brand-300">{lines[close].text}</span>
          </>
        )}
      </motion.div>,
    );

    if (isCollapsed && close !== undefined) i = close; // pula o conteúdo recolhido
  }

  return (
    <div className="flex h-full min-h-48 flex-col overflow-hidden rounded-lg border border-ink-600 bg-ink-900">
      <div className="flex items-center justify-between border-b border-ink-600 bg-ink-800 px-3 py-1.5 font-mono text-xs text-ink-400">
        <span>
          <span className="text-brand-300">Tree.xml</span> · {lines.length} {lines.length === 1 ? "linha" : "linhas"}
        </span>
        <span className="hidden sm:inline">clique em ▼ para recolher</span>
      </div>
      <div className="flex-1 overflow-auto py-2">
        {lines.length === 0 ? <p className="px-3 font-mono text-xs text-ink-400">(arquivo vazio)</p> : rows}
      </div>
    </div>
  );
}

export default function TreeXmlSim({ sim }: { sim: TreeXmlSimData }) {
  const dims = useMemo(() => treeDims(sim.frames), [sim.frames]);

  return (
    <SimShell title={sim.title} code={sim.code} frames={sim.frames}>
      {(f) => (
        <div className="grid gap-3 p-1 md:grid-cols-[1.15fr_1fr]">
          <TreeCanvas frame={f} dims={dims} label={sim.title} />
          <XmlPane lines={f.xml} />
        </div>
      )}
    </SimShell>
  );
}