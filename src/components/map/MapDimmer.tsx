import Box from '@mui/material/Box';
import { useMapSettings } from '@/components/map/MapSettingsContext';

// A black scrim over the map, its opacity driven by the map dim setting. Sits
// above the map but below the control bar (z2) and HUD (z3), and never eats
// pointer events so the map stays interactive.
const MapDimmer = () => {
  const { dim } = useMapSettings();
  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        bgcolor: '#000',
        opacity: dim,
        transition: 'opacity 160ms ease',
      }}
    />
  );
};

export default MapDimmer;
