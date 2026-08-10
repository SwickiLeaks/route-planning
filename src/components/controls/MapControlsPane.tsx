import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { colors } from '@/theme/tokens';
import { MONO, MUTED } from '@/components/shared/hudStyle';
import { useMapSettings } from '@/components/map/MapSettingsContext';

// Map display controls. Currently a single dimness slider that drives the on-map
// scrim; more map settings can join this panel later.
const MapControlsPane = () => {
  const { dim, setDim } = useMapSettings();
  const pct = Math.round(dim * 100);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 240, px: 0.5, py: 0.25 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <DarkModeOutlinedIcon sx={{ fontSize: 17, color: colors.accent }} />
        <Box sx={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: colors.white }}>Dimness</Box>
        <Box sx={{ fontFamily: MONO, fontSize: 12, color: MUTED, minWidth: 34, textAlign: 'right' }}>
          {pct}%
        </Box>
      </Box>
      <Slider
        size="small"
        value={pct}
        min={0}
        max={80}
        onChange={(_, v) => setDim((Array.isArray(v) ? v[0] : v) / 100)}
        aria-label="Map dimness"
        sx={{ color: colors.accent, mx: '4px', width: 'auto' }}
      />
    </Box>
  );
};

export default MapControlsPane;
