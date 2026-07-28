import Box from '@mui/material/Box';
import { colors } from '@/theme/tokens';
import type { RouteCalculation } from '@/calc/types';
import { MONO, MUTED, FAINT, fmtLb, fuelStateColor } from '@/components/shared/hudStyle';

// Linear interpolate between two #rrggbb colors.
const lerpHex = (a: string, b: string, t: number): string => {
  const ca = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const cb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const mix = ca.map((v, k) => Math.round(v + (cb[k] - v) * t));
  return `#${mix.map((x) => x.toString(16).padStart(2, '0')).join('')}`;
};

// Route-wide fuel bar: per-leg burn segments, fuel left, reserve floor.
const FuelConsumption = ({ calc }: { calc: RouteCalculation }) => {
  const t = calc.totals;
  const capacity = t.startFuelLb;
  const accent = fuelStateColor(t.fuelState);
  const legs = calc.legs;

  const pct = (lb: number) => `${(Math.max(lb, 0) / capacity) * 100}%`;
  const reserveLeft = ((capacity - t.reserveLb) / capacity) * 100;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 11, color: MUTED }}>
        <span style={{ letterSpacing: '0.04em' }}>FUEL CONSUMPTION</span>
        <Box sx={{ display: 'flex', gap: '10px', fontFamily: MONO }}>
          <span>
            <span style={{ color: colors.gold }}>{fmtLb(t.routeFuelLb)}</span> burned
          </span>
          <span>
            <span style={{ color: accent }}>{fmtLb(t.remainingFuelLb)}</span> left
          </span>
          <span style={{ color: FAINT }}>/ {fmtLb(capacity)} lb</span>
        </Box>
      </Box>

      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          height: 22,
          borderRadius: '5px',
          overflow: 'hidden',
          bgcolor: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {legs.map((leg, i) => {
          const color = lerpHex(colors.accent, colors.gold, legs.length > 1 ? i / (legs.length - 1) : 0);
          const width = (leg.legFuelLb / capacity) * 100;
          return (
            <Box
              key={leg.index}
              title={`Leg ${i + 1} · ${fmtLb(leg.legFuelLb)} lb`}
              sx={{
                width: `${width}%`,
                bgcolor: color,
                boxShadow: 'inset -1px 0 0 rgba(0,0,0,0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: MONO,
                fontSize: 10,
                color: 'rgba(0,0,0,0.75)',
                fontWeight: 600,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                transition: 'width 300ms',
              }}
            >
              {width > 6 ? `L${i + 1}` : ''}
            </Box>
          );
        })}

        <Box sx={{ width: pct(t.remainingFuelLb), transition: 'width 300ms' }} />

        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${reserveLeft}%`,
            right: 0,
            bgcolor: `${colors.red}14`,
            borderLeft: `2px dashed ${colors.red}aa`,
            pointerEvents: 'none',
          }}
        />
      </Box>

      <Box sx={{ position: 'relative', height: 12 }}>
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            fontFamily: MONO,
            fontSize: 10,
            color: FAINT,
          }}
        >
          reserve {fmtLb(t.reserveLb)} lb
        </Box>
      </Box>
    </Box>
  );
};

export default FuelConsumption;
