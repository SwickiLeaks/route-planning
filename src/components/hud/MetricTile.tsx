import Box from '@mui/material/Box';
import { colors } from '@/theme/tokens';
import { MONO, MUTED, FAINT, glassPane } from '@/components/shared/hudStyle';

interface MetricTileProps {
  label: string;
  value: string;
  unit?: string;
  accent?: string;
}

// A single route metric as a floating glass tile.
const MetricTile = ({ label, value, unit, accent = colors.white }: MetricTileProps) => (
  <Box
    sx={{
      ...glassPane,
      px: '15px',
      py: '9px',
      minWidth: 96,
      display: 'flex',
      flexDirection: 'column',
      gap: '3px',
    }}
  >
    <Box sx={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.05em', color: MUTED, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
      {label}
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
      <Box sx={{ fontFamily: MONO, fontSize: 23, fontWeight: 500, lineHeight: 1, color: accent, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </Box>
      {unit && <Box sx={{ fontSize: 11, color: FAINT }}>{unit}</Box>}
    </Box>
  </Box>
);

export default MetricTile;
