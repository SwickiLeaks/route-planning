import { Marker } from 'react-map-gl/maplibre';
import Box from '@mui/material/Box';
import { colors } from '@/theme/tokens';
import type { LegCalc } from '@/calc/types';
import { MONO } from '@/components/shared/hudStyle';

// Small circular badge showing the leg number, centered on the leg.
const LegCallout = ({ leg, calculating = false }: { leg: LegCalc; calculating?: boolean }) => (
  <Marker longitude={leg.midpoint.lng} latitude={leg.midpoint.lat} anchor="center">
    <Box
      sx={{
        pointerEvents: 'none',
        width: 22,
        height: 22,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(15,15,17,0.8)',
        border: `1.5px solid ${colors.accent}aa`,
        fontFamily: MONO,
        fontSize: 11,
        fontWeight: 700,
        color: colors.accent,
        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
        animation: calculating ? 'hud-pulse 1.1s ease-in-out infinite' : 'none',
      }}
    >
      {leg.index + 1}
    </Box>
  </Marker>
);

export default LegCallout;
