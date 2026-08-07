import { colors } from '@/theme/tokens';
import type { FuelState } from '@/calc/types';

// Monospace for numeric readouts — tabular figures read as instrument values.
export const MONO =
  "'SFMono-Regular', ui-monospace, 'Roboto Mono', Menlo, Consolas, monospace";

// Muted / faint label inks on dark surfaces.
export const MUTED = 'rgba(231,227,218,0.6)';
export const FAINT = 'rgba(231,227,218,0.4)';

// Placeholder for a calculated value that isn't wired to the backend yet.
export const PENDING = '—';

export const PANEL_BORDER = '1px solid rgba(255,255,255,0.09)';

// See-through glass for floating HUD panes.
export const glassPane = {
  bgcolor: 'rgba(13,13,14,0.5)',
  backdropFilter: 'blur(18px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  boxShadow: '0 8px 28px rgba(0,0,0,0.4)',
} as const;

// Subtle surface glow for markers (never text).
export const glow = (color: string = colors.accent) => `0 0 10px ${color}44`;

// Fuel state → accent color.
export const fuelStateColor = (state: FuelState): string =>
  state === 'critical' ? colors.red : state === 'caution' ? colors.gold : colors.accent;

export const fmtHrMin = (min: number): string => {
  const total = Math.round(min);
  return `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, '0')}`;
};

export const fmtMinSec = (min: number): string => {
  const secs = Math.round(min * 60);
  return `${Math.floor(secs / 60)}:${(secs % 60).toString().padStart(2, '0')}`;
};

export const fmtLb = (lb: number): string => `${Math.round(lb).toLocaleString()}`;
export const fmtNm = (nm: number): string => nm.toFixed(1);
