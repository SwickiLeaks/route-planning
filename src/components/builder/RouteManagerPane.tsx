import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RouteIcon from '@mui/icons-material/Route';
import AddIcon from '@mui/icons-material/Add';
import { colors } from '@/theme/tokens';
import { MONO, MUTED, FAINT } from '@/components/shared/hudStyle';
import { useRouteBuilder } from '@/route/RouteBuilderContext';
import { distanceNm } from '@/map/geo';

// Sums leg distances across the waypoint list in nautical miles.
const totalNm = (points: { position: { lat: number; lng: number } }[]): number => {
  let sum = 0;
  for (let i = 1; i < points.length; i += 1) {
    sum += distanceNm(points[i - 1].position, points[i].position);
  }
  return sum;
};

// A centered value-over-label stat readout.
const Stat = ({ value, label }: { value: string; label: string }) => (
  <Box sx={{ textAlign: 'center' }}>
    <Box sx={{ fontFamily: MONO, fontSize: 15, color: colors.white }}>{value}</Box>
    <Box sx={{ fontSize: 10, letterSpacing: '0.05em', color: MUTED, textTransform: 'uppercase' }}>{label}</Box>
  </Box>
);

// Route selector; the demo carries one active route for now.
const RouteManagerPane = () => {
  const { route } = useRouteBuilder();
  const nm = totalNm(route.waypoints);

  return (
    <Stack spacing={1.5} sx={{ width: 'min(560px, 100%)', mx: 'auto', py: 0.5 }}>
      <Typography sx={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', color: MUTED, textTransform: 'uppercase', textAlign: 'center' }}>
        Routes
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          py: 1.5,
          borderRadius: '10px',
          border: `1px solid ${colors.accent}`,
          bgcolor: `${colors.accent}14`,
        }}
      >
        <RouteIcon sx={{ fontSize: 22, color: colors.accent }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.white }} noWrap>
              {route.name}
            </Typography>
            <CheckCircleIcon sx={{ fontSize: 16, color: colors.accent }} />
          </Box>
          <Typography sx={{ fontSize: 11, color: MUTED }}>Active</Typography>
        </Box>
        <Stack direction="row" spacing={2.5}>
          <Stat value={String(route.waypoints.length)} label="WPT" />
          <Stat value={nm.toFixed(1)} label="NM" />
        </Stack>
      </Box>

      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'center' }}>
        <Button variant="outlined" color="inherit" startIcon={<AddIcon />} disabled>
          New Route
        </Button>
      </Stack>

      <Typography variant="caption" sx={{ color: FAINT, textAlign: 'center' }}>
        One route in this demo. Multiple selectable routes coming later.
      </Typography>
    </Stack>
  );
};

export default RouteManagerPane;
