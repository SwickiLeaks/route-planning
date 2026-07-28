import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { FAINT } from '@/components/hud/hudStyle';
import { useRouteBuilder } from '@/route/RouteBuilderContext';

/** Parses a coordinate field; returns null if not a finite number in range. */
const parseCoord = (raw: string, max: number): number | null => {
  const n = Number(raw);
  return Number.isFinite(n) && Math.abs(n) <= max ? n : null;
};

/**
 * A compact, single-row waypoint creator — wide, not tall, to keep map space.
 */
const WaypointCreatorPane = () => {
  const { addWaypoint, route } = useRouteBuilder();
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
      spacing={1}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      sx={{ alignItems: 'center', py: 0.5 }}
    >
      <Stack direction="row" spacing={1.25} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <TextField size="small" label="Latitude" placeholder="36.123" value={lat} onChange={(e) => setLat(e.target.value)} error={lat !== '' && latN == null} sx={{ width: '8.5rem' }} />
        <TextField size="small" label="Longitude" placeholder="-86.678" value={lng} onChange={(e) => setLng(e.target.value)} error={lng !== '' && lngN == null} sx={{ width: '8.5rem' }} />
        <TextField size="small" label="Name" placeholder="optional" value={name} onChange={(e) => setName(e.target.value)} sx={{ width: '12rem' }} />
        <TextField size="small" label="Altitude ft" placeholder="optional" value={alt} onChange={(e) => setAlt(e.target.value)} sx={{ width: '8rem' }} />
        <Button type="submit" variant="contained" color="primary" startIcon={<AddLocationAltIcon />} disabled={!valid}>
          Add
        </Button>
      </Stack>

      <Typography variant="caption" sx={{ color: FAINT }}>
        Decimal degrees · {route.waypoints.length} in route · map-click placement coming later
      </Typography>
    </Stack>
  );
};

export default WaypointCreatorPane;
