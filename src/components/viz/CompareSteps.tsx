import { useState } from "react";

const fmt = (v: number) => v.toLocaleString("pt-BR");

// tempo para `ns` nanossegundos
function tempo(ns: number) {
  if (ns < 1e3) return `${fmt(Math.round(ns))} ns`;
  if (ns < 1e6) return `${(ns / 1e3).toFixed(1).replace(".", ",")} µs`;
  if (ns < 1e9) return `${(ns / 1e6).toFixed(1).replace(".", ",")} ms`;
  return `${(ns / 1e9).toFixed(1).replace(".", ",")} s`;
}

/** Pior caso da busca sequencial × busca binária para n = 10^k. Uso no MDX: <CompareSteps /> */
export default function CompareSteps() {
  const [k, setK] = useState(6);
  const n = 10 ** k;
  const bin = Math.floor(Math.log2(n)) + 1;
  const pctBin = Math.max(0.4, (bin / n) * 100);

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-card border border-ink-600 bg-ink-900">
      <figcaption className="flex items-center gap-2 border-b border-ink-600 bg-ink-800 px-4 py-2 font-mono text-xs text-ink-400">
        <span className="size-2 rounded-full bg-brand-500" />
        comparação · <span className="text-brand-300">pior caso: sequencial × binária</span>
      </figcaption>

      <div className="space-y-4 px-4 py-4">
        <label className="flex items-center gap-3 font-mono text-xs text-ink-200">
          n =
          <span className="w-36 text-warn">{fmt(n)}</span>
          <input
            type="range" min={1} max={9} value={k}
            onChange={(e) => setK(Number(e.target.value))}
            aria-label="Tamanho do vetor (potência de 10)"
            className="flex-1 accent-brand-500"
          />
        </label>

        {[
          { nome: "Sequencial", passos: n, pct: 100, cor: "var(--color-danger)" },
          { nome: "Binária", passos: bin, pct: pctBin, cor: "var(--color-ok)" },
        ].map((b) => (
          <div key={b.nome}>
            <div className="mb-1 flex justify-between font-mono text-xs">
              <span className="text-white">{b.nome}</span>
              <span className="text-ink-200">
                <span className="text-warn">{fmt(b.passos)}</span> comparações · {tempo(b.passos)}
              </span>
            </div>
            <div className="h-4 overflow-hidden rounded bg-ink-800">
              <div className="h-full rounded transition-all duration-500" style={{ width: `${b.pct}%`, background: b.cor }} />
            </div>
          </div>
        ))}

        <p className="font-mono text-xs text-ink-400">
          Supondo 1 ns (um bilionésimo de segundo) por comparação. Com n = {fmt(n)}, a binária faz{" "}
          <span className="text-ok">{fmt(Math.round(n / bin))}×</span> menos comparações.
        </p>
      </div>
    </figure>
  );
}
