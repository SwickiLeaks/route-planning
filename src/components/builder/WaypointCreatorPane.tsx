import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import PinDropIcon from '@mui/icons-material/PinDrop';
import CheckIcon from '@mui/icons-material/Check';
import { colors } from '@/theme/tokens';
import { MUTED, FAINT } from '@/components/shared/hudStyle';
import { useRouteBuilder } from '@/route/RouteBuilderContext';

// Parses a coordinate; null if not a finite number within range.
const parseCoord = (raw: string, max: number): number | null => {
  const n = Number(raw);
  return Number.isFinite(n) && Math.abs(n) <= max ? n : null;
};

// Manual lat/lng entry in a compact single row.
const ManualEntry = () => {
  const { addWaypoint } = useRouteBuilder();
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [name, setName] = useState('');
  const [alt, setAlt] = useState('');

  const latN = parseCoord(lat, 90);
  const lngN = parseCoord(lng, 180);
  const valid = latN != null && lngN != null;

  const submit = () => {
    if (!valid) return;
    const altN = Number(alt);
    addWaypoint({ lat: latN, lng: lngN }, name, Number.isFinite(altN) && alt !== '' ? altN : undefined);
    setLat('');
    setLng('');
    setName('');
    setAlt('');
  };

  return (
    <Stack
      component="form"
      direction="row"
      spacing={1.25}
      useFlexGap
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      sx={{ alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}
    >
      <TextField size="small" label="Latitude" placeholder="36.123" value={lat} onChange={(e) => setLat(e.target.value)} error={lat !== '' && latN == null} sx={{ width: '8.5rem' }} />
      <TextField size="small" label="Longitude" placeholder="-86.678" value={lng} onChange={(e) => setLng(e.target.value)} error={lng !== '' && lngN == null} sx={{ width: '8.5rem' }} />
      <TextField size="small" label="Name" placeholder="optional" value={name} onChange={(e) => setName(e.target.value)} sx={{ width: '12rem' }} />
      <TextField size="small" label="Altitude ft" placeholder="optional" value={alt} onChange={(e) => setAlt(e.target.value)} sx={{ width: '8rem' }} />
      <Button type="submit" variant="contained" color="primary" startIcon={<AddLocationAltIcon />} disabled={!valid}>
        Add
      </Button>
    </Stack>
  );
};

// Click-to-place mode toggle with live status.
const MapPlacement = () => {
  const { placing, setPlacing, route } = useRouteBuilder();

  useEffect(() => {
    if (!placing) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPlacing(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [placing, setPlacing]);

  useEffect(() => () => setPlacing(false), [setPlacing]);

  if (!placing) {
    return (
      <Stack spacing={0.75} sx={{ alignItems: 'center' }}>
        <Button variant="outlined" color="primary" startIcon={<PinDropIcon />} onClick={() => setPlacing(true)}>
          Drop on Map
        </Button>
        <Typography variant="caption" sx={{ color: FAINT }}>
          Then click anywhere on the map to place waypoints.
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={0.75} sx={{ alignItems: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          px: 1.5,
          py: 1,
          borderRadius: '9px',
          border: `1px solid ${colors.accent}`,
          bgcolor: `${colors.accent}1f`,
        }}
      >
        <PinDropIcon sx={{ fontSize: 20, color: colors.accent, animation: 'hud-pulse 1.2s ease-in-out infinite' }} />
        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: colors.white }}>
            Click the map to place waypoints
          </Typography>
          <Typography variant="caption" sx={{ color: MUTED }}>
            {route.waypoints.length} in route · press Esc when done
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<CheckIcon />} onClick={() => setPlacing(false)} sx={{ ml: 0.5 }}>
          Done
        </Button>
      </Box>
    </Stack>
  );
};

// Create waypoints via manual entry or click-to-place on the map.
const WaypointCreatorPane = () => (
  <Stack spacing={1.5} sx={{ alignItems: 'center', py: 0.5 }}>
    <ManualEntry />
    <Divider flexItem>
      <Typography variant="caption" sx={{ color: FAINT, px: 1 }}>
        OR
      </Typography>
    </Divider>
    <MapPlacement />
  </Stack>
);

export default WaypointCreatorPane;
