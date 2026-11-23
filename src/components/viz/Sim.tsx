import { sims } from "../../viz-data";
import ListSim from "./ListSim";
import ArraySim from "./ArraySim";
import RowsSim from "./RowsSim";
import CallTreeSim from "./CallTreeSim";
import TreeSim from "./TreeSim";
import TreeXmlSim from "./TreeXmlSim";

export default function Sim({ name }: { name: string }) {
  const sim = sims[name];

  if (!sim) {
    return (
      <p className="not-prose my-6 rounded-card border border-danger/50 bg-ink-900 p-4 font-mono text-sm text-danger">
        Simulação "{name}" não encontrada em src/viz-data/index.ts
      </p>
    );
  }

  // `kind` decide qual desenho usar. Sem `kind` = lista (compatível com os arquivos antigos)
  if (sim.kind === "array") return <ArraySim sim={sim} />;
    if (sim.kind === "rows") return <RowsSim sim={sim} />;
  if (sim.kind === "calltree") return <CallTreeSim sim={sim} />;
   if (sim.kind === "tree") return <TreeSim sim={sim} />;
  if (sim.kind === "treexml") return <TreeXmlSim sim={sim} />;
  return <ListSim sim={sim} />;
}