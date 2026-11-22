import { graphs } from "../../viz-data/graphs";
import GraphViz from "./GraphViz";

export default function Grafo({ name }: { name: string }) {
  const graph = graphs[name];

  if (!graph) {
    return (
      <p className="not-prose my-6 rounded-card border border-danger/50 bg-ink-900 p-4 font-mono text-sm text-danger">
        Grafo "{name}" não encontrado em src/viz-data/graphs.ts
      </p>
    );
  }

  return <GraphViz graph={graph} />;
}