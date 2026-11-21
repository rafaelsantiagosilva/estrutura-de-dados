export const W = 640;
export const H = 340;
export const M = { l: 56, r: 16, t: 16, b: 40 }; // margens
export const PW = W - M.l - M.r;                 // largura da área do gráfico
export const PH = H - M.t - M.b;                 // altura da área do gráfico

export type Scale = (v: number) => number;

// 1200000 → "1,2 mi"
export const fmt = (v: number) =>
  new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(v);

function niceStep(raw: number) {
  const p = 10 ** Math.floor(Math.log10(raw));
  const m = raw / p;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p;
}

export function linearTicks(max: number, count = 5) {
  const step = niceStep(max / count);
  const out: number[] = [];
  for (let v = 0; v <= max + 1e-9; v += step) out.push(Number(v.toFixed(10)));
  return out;
}

export function logTicks(max: number) {
  const out: number[] = [];
  for (let v = 1; v <= max; v *= 10) out.push(v);
  return out;
}

// Monta o `d` de um <path>. Limita o y para não gerar coordenadas gigantes (o clipPath esconde o excesso).
export function linePath(xs: number[], ys: number[], sx: Scale, sy: Scale) {
  const floor = M.t - 30;
  return xs
    .map((x, i) => `${i ? "L" : "M"}${sx(x).toFixed(1)} ${Math.max(sy(ys[i]), floor).toFixed(1)}`)
    .join(" ");
}

type AxesProps = {
  xTicks: number[];
  yTicks: number[];
  sx: Scale;
  sy: Scale;
  xLabel?: string;
  yLabel?: string;
};

export function Axes({ xTicks, yTicks, sx, sy, xLabel, yLabel }: AxesProps) {
  const muted = { fill: "var(--color-ink-400)" };
  return (
    <g className="font-mono text-[11px]">
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={M.l} x2={W - M.r} y1={sy(v)} y2={sy(v)} style={{ stroke: "var(--color-ink-700)" }} />
          <text x={M.l - 8} y={sy(v)} dy="0.35em" textAnchor="end" style={muted}>{fmt(v)}</text>
        </g>
      ))}
      {xTicks.map((v) => (
        <text key={`x${v}`} x={sx(v)} y={H - M.b + 18} textAnchor="middle" style={muted}>{fmt(v)}</text>
      ))}
      <line x1={M.l} x2={M.l} y1={M.t} y2={H - M.b} style={{ stroke: "var(--color-ink-400)" }} />
      <line x1={M.l} x2={W - M.r} y1={H - M.b} y2={H - M.b} style={{ stroke: "var(--color-ink-400)" }} />
      {xLabel && (
        <text x={M.l + PW / 2} y={H - 6} textAnchor="middle" style={muted}>{xLabel}</text>
      )}
      {yLabel && (
        <text transform={`translate(14 ${M.t + PH / 2}) rotate(-90)`} textAnchor="middle" style={muted}>
          {yLabel}
        </text>
      )}
    </g>
  );
}