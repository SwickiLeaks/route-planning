import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { colors } from '@/theme/tokens';
import type { FuelState } from '@/calc/types';

/**
 * Monospace — used ONLY for numeric values, where tabular alignment reads as an
 * instrument. Labels and names use the theme's sans, which is far more legible
 * at small sizes.
 */
export const MONO =
  "'SFMono-Regular', ui-monospace, 'Roboto Mono', Menlo, Consolas, monospace";

/** Soft dark shadow for text sitting directly over the map — legible, no bloom. */
export const TEXT_SHADOW = '0 1px 3px rgba(0,0,0,0.9)';

/** Muted / faint label inks on dark (neutral bone). */
export const MUTED = 'rgba(230,230,224,0.6)';
export const FAINT = 'rgba(230,230,224,0.4)';

/** Calm neutral-charcoal surface for panels and map chips. */
export const PANEL_BG = 'rgba(18,19,21,0.9)';
export const PANEL_BORDER = '1px solid rgba(255,255,255,0.09)';

/**
 * See-through glass — for floating HUD panes that should read as part of the
 * map. More transparent than PANEL_BG, leaning on blur for legibility.
 */
export const glassPane = {
  bgcolor: 'rgba(13,14,15,0.5)',
  backdropFilter: 'blur(18px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  boxShadow: '0 8px 28px rgba(0,0,0,0.4)',
} as const;

/** A gentle surface glow for markers (never text) — subtle, doesn't bloom. */
export const glow = (color: string = colors.accent) => `0 0 10px ${color}44`;

/** Fuel state → accent color. */
export const fuelStateColor = (state: FuelState): string =>
  state === 'critical' ? colors.red : state === 'caution' ? colors.gold : colors.accent;

/* ── Formatters ───────────────────────────────────────────────────────── */

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

/* ── Panel ────────────────────────────────────────────────────────────── */

/**
 * A calm, rounded HUD panel with a soft top accent line — replaces the sharp
 * reticle-bracket frame. Easier on the eyes in the dark.
 */
export const HudFrame = ({
  children,
  accent = colors.accent,
  sx,
}: {
  children: ReactNode;
  accent?: string;
  sx?: SxProps<Theme>;
}) => (
  <Box
    sx={{
      position: 'relative',
      bgcolor: PANEL_BG,
      backdropFilter: 'blur(16px)',
      border: PANEL_BORDER,
      borderRadius: '12px',
      boxShadow: '0 10px 34px rgba(0,0,0,0.55)',
      overflow: 'hidden',
      ...sx,
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        bgcolor: accent,
        opacity: 0.45,
      }}
    />
    {children}
  </Box>
);

/** A label over a value: label in readable sans, value in mono, no glow. */
export const Readout = ({
  label,
  value,
  unit,
  accent = colors.white,
  size = 22,
}: {
  label: string;
  value: string;
  unit?: string;
  accent?: string;
  size?: number;
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
    <Box
      sx={{
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.05em',
        color: MUTED,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
      <Box
        sx={{
          fontFamily: MONO,
          fontSize: size,
          fontWeight: 500,
          lineHeight: 1,
          color: accent,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </Box>
      {unit && <Box sx={{ fontSize: 12, color: FAINT }}>{unit}</Box>}
    </Box>
  </Box>
);
