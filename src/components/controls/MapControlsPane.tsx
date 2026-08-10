import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Brightness6Icon from '@mui/icons-material/Brightness6';
import { colors } from '@/theme/tokens';
import { useMapSettings } from '@/components/map/MapSettingsContext';

// Leftmost (least brightness) still leaves the map faintly visible.
const MAX_DIM = 0.8;

// Map display controls. A single brightness slider for now — right is full
// brightness (no dim), left is darkest — with room for more map settings later.
const MapControlsPane = () => {
  const { dim, setDim } = useMapSettings();
  const brightness = Math.round((1 - dim / MAX_DIM) * 100);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, width: 190, px: 0.5, py: 0.25 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Brightness6Icon sx={{ fontSize: 16, color: colors.accent }} />
        <Box sx={{ fontSize: 12, fontWeight: 600, color: colors.white }}>Map Brightness</Box>
      </Box>
      <Slider
        size="small"
        value={brightness}
        min={0}
        max={100}
        onChange={(_, v) => setDim((1 - (Array.isArray(v) ? v[0] : v) / 100) * MAX_DIM)}
        aria-label="Map brightness"
        sx={{ color: colors.accent, mx: '4px', width: 'auto' }}
      />
    </Box>
  );
};

export default MapControlsPane;
