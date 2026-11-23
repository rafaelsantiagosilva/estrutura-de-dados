import { useMemo, useState } from "react";
import TreeSim from "./CallTreeSim";
import { makeMergeTree, makeQuickTree } from "../../viz-data/nlogn";

type Preset = { nome: string; valores: number[] };
type Props = {
  algo: "merge" | "quick";
  presets: Preset[]; // vetores que o aluno pode testar (use até 8 elementos)
};

/** O aluno escolhe o vetor e a árvore de chamadas é gerada na hora. */
export default function TreeLab({ algo, presets }: Props) {
  const [i, setI] = useState(0);
  const p = presets[i];
  const sim = useMemo(
    () => (algo === "merge" ? makeMergeTree(p.valores) : makeQuickTree(p.valores)),
    [algo, p],
  );

  return (
    <div className="not-prose my-8">
      <div className="rounded-t-card border border-b-0 border-ink-600 bg-ink-800 px-4 py-3">
        <p className="font-mono text-xs text-ink-400">
          🧪 laboratório · vetor = <span className="text-brand-300">[{p.valores.join(", ")}]</span>
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="text-ink-400">testar com:</span>
          {presets.map((q, k) => (
            <button
              key={q.nome}
              aria-pressed={k === i}
              onClick={() => setI(k)}
              className={`rounded-md border px-2.5 py-1 transition ${
                k === i ? "border-brand-500 bg-brand-900 text-white" : "border-ink-600 text-ink-200 hover:border-brand-500"
              }`}
            >
              {q.nome}
            </button>
          ))}
        </div>
      </div>
      <div className="[&>figure]:mt-0 [&>figure]:rounded-t-none">
        <TreeSim key={`${algo}-${i}`} sim={sim} />
      </div>
    </div>
  );
}
