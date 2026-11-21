import { sims } from "../../viz-data";
import ListSim from "./ListSim";

export default function Sim({ name }: { name: string }) {
  const sim = sims[name];
  if (!sim) {
    return (
      <p className="not-prose my-6 rounded-card border border-danger/50 bg-ink-900 p-4 font-mono text-sm text-danger">
        Simulação "{name}" não encontrada em src/viz-data/index.ts
      </p>
    );
  }
  return <ListSim sim={sim} />;
}