import Tex from "./Tex";

type Row = { code: string; cost: string; times: string };
type Props = {
  rows: Row[];
  total: string;   // LaTeX: a soma "custo × vezes"
  result: string;  // LaTeX: ex.: "\\Theta(n)"
};

export default function CostTable({ rows, total, result }: Props) {
  return (
    <figure className="not-prose my-8 overflow-hidden rounded-card border border-ink-600 bg-ink-900">
      <figcaption className="flex items-center gap-2 border-b border-ink-600 bg-ink-800 px-4 py-2 font-mono text-xs text-ink-400">
        <span className="size-2 rounded-full bg-brand-500" />
        contagem de operações · <span className="text-brand-300">T(n)</span>
      </figcaption>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-ink-600 text-left font-mono text-xs text-ink-400">
              <th className="px-4 py-2 font-normal">Linha de código</th>
              <th className="px-4 py-2 font-normal">Custo</th>
              <th className="px-4 py-2 font-normal">Vezes executada</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-ink-700">
                <td className="whitespace-pre px-4 py-2 font-mono text-brand-300">{r.code}</td>
                <td className="px-4 py-2"><Tex tex={r.cost} /></td>
                <td className="px-4 py-2"><Tex tex={r.times} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-2 border-t border-ink-600 bg-brand-900/30 px-4 py-4">
        <p className="font-mono text-xs text-ink-400">Somando (custo × vezes) de todas as linhas:</p>
        <Tex block tex={total} />
        <p className="font-mono text-sm text-white">
          Portanto:{" "}
          <span className="ml-1 rounded-md border border-brand-500/50 bg-brand-900 px-2 py-0.5 text-brand-300">
            <Tex tex={`T(n) = ${result}`} />
          </span>
        </p>
      </div>
    </figure>
  );
}