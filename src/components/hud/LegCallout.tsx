import { Marker } from 'react-map-gl/maplibre';
import Box from '@mui/material/Box';
import { colors } from '@/theme/tokens';
import type { LegCalc } from '@/calc/types';
import { MONO } from '@/components/hud/hudStyle';

/**
 * A minimal leg marker: a small circular badge with just the leg number,
 * centered on the leg. Deliberately a different shape from the rectangular
 * named waypoint chips so the two don't clash on a dense route — the full leg
 * stats live in the bottom HUD's legs pane. 22px (even) keeps it pixel-sharp.
 */
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
        bgcolor: 'rgba(15,15,14,0.8)',
        border: `1.5px solid ${colors.yellow}aa`,
        fontFamily: MONO,
        fontSize: 11,
        fontWeight: 700,
        color: colors.yellow,
        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
        animation: calculating ? 'hud-pulse 1.1s ease-in-out infinite' : 'none',
      }}
    >
      {leg.index + 1}
    </Box>
  </Marker>
);

export default LegCallout;
