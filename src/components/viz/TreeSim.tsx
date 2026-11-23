import { useMemo } from "react";
import type { TreeSimData } from "../../viz-data/arvores/treeTypes";
import SimShell from "./SimShell";
import TreeCanvas from "./TreeCanvas";
import { treeDims } from "./treeLayout";

export default function TreeSim({ sim }: { sim: TreeSimData }) {
  const dims = useMemo(() => treeDims(sim.frames), [sim.frames]);

  return (
    <SimShell title={sim.title} code={sim.code} frames={sim.frames}>
      {(f) => <TreeCanvas frame={f} dims={dims} label={sim.title} />}
    </SimShell>
  );
}