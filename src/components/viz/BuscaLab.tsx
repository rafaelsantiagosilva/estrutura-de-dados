import { useMemo, useState } from "react";
import ArraySim from "./ArraySim";
import { VETOR_BIN, VETOR_SEQ, makeBuscaBin, makeBuscaSeq } from "../../viz-data/buscas";

type Props = {
  tipo: "sequencial" | "binaria";
  chaves: number[]; // as chaves que o aluno pode testar
};

/** O aluno escolhe a chave e a simulação é gerada na hora. Uso no MDX: <BuscaLab tipo="binaria" chaves={[3, 12, 7]} /> */
export default function BuscaLab({ tipo, chaves }: Props) {
  const [chave, setChave] = useState(chaves[0]);
  const vetor = tipo === "sequencial" ? VETOR_SEQ : VETOR_BIN;
  const sim = useMemo(() => (tipo === "sequencial" ? makeBuscaSeq(chave) : makeBuscaBin(chave)), [tipo, chave]);

  return (
    <div className="not-prose my-8">
      <div className="rounded-t-card border border-b-0 border-ink-600 bg-ink-800 px-4 py-3">
        <p className="font-mono text-xs text-ink-400">
          🧪 laboratório · vetor = <span className="text-brand-300">[{vetor.join(", ")}]</span>
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="text-ink-400">procurar a chave:</span>
          {chaves.map((c) => {
            const existe = vetor.includes(c);
            return (
              <button
                key={c}
                aria-pressed={c === chave}
                onClick={() => setChave(c)}
                className={`rounded-md border px-2.5 py-1 transition ${
                  c === chave
                    ? "border-brand-500 bg-brand-900 text-white"
                    : "border-ink-600 text-ink-200 hover:border-brand-500"
                }`}
              >
                {c} <span className="text-ink-400">{existe ? "" : "(ausente)"}</span>
              </button>
            );
          })}
        </div>
      </div>
      {/* key: trocar a chave recomeça a simulação do zero */}
      <div className="[&>figure]:mt-0 [&>figure]:rounded-t-none">
        <ArraySim key={`${tipo}-${chave}`} sim={sim} />
      </div>
    </div>
  );
}
