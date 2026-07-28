import { colors } from '@/theme/tokens';
import { MONO, MUTED } from '@/components/hud/hudStyle';

interface ArcGaugeProps {
  value: number;
  max: number;
  label: string;
  unit: string;
  accent?: string;
  size?: number;
}

const polar = (cx: number, cy: number, r: number, deg: number) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

/** 270° arc from `start` to `end` degrees. */
const arcPath = (cx: number, cy: number, r: number, start: number, end: number) => {
  const a = polar(cx, cy, r, start);
  const b = polar(cx, cy, r, end);
  const large = end - start > 180 ? 1 : 0;
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${large} 1 ${b.x} ${b.y}`;
};

/** A 270° instrument arc — the tactical dial for fuel flow. */
const ArcGauge = ({
  value,
  max,
  label,
  unit,
  accent = colors.accent,
  size = 72,
}: ArcGaugeProps) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 6;
  const START = -135;
  const SWEEP = 270;
  const frac = Math.max(0, Math.min(1, value / max));

  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      <path
        d={arcPath(cx, cy, r, START, START + SWEEP)}
        fill="none"
        stroke={`${colors.olive}44`}
        strokeWidth={4}
        strokeLinecap="round"
      />
      {frac > 0 && (
        <path
          d={arcPath(cx, cy, r, START, START + SWEEP * frac)}
          fill="none"
          stroke={accent}
          strokeWidth={4}
          strokeLinecap="round"
          style={{ transition: 'all 300ms' }}
        />
      )}
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={17}
        fontWeight={500}
        fill={colors.white}
      >
        {Math.round(value).toLocaleString()}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize={9} fill={MUTED}>
        {unit}
      </text>
      <text x={cx} y={size - 1} textAnchor="middle" fontSize={10} fill={MUTED} letterSpacing="0.04em">
        {label}
      </text>
    </svg>
  );
};

export default ArcGauge;
