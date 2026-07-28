import { useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useRouteBuilder } from '@/route/RouteBuilderContext';
import type { BuilderWaypoint } from '@/route/routeBuilderTypes';

// Parses a number, or null if non-finite or out of range.
const parse = (raw: string, max?: number): number | null => {
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  if (max != null && Math.abs(n) > max) return null;
  return n;
};

// Live editor for the selected waypoint's name, position, and altitude.
const WaypointDetailsEditor = ({ waypoint }: { waypoint: BuilderWaypoint }) => {
  const { updateWaypoint } = useRouteBuilder();
  const [name, setName] = useState(waypoint.name);
  const [lat, setLat] = useState(String(waypoint.position.lat));
  const [lng, setLng] = useState(String(waypoint.position.lng));
  const [alt, setAlt] = useState(waypoint.altitudeFt != null ? String(waypoint.altitudeFt) : '');

  const latN = parse(lat, 90);
  const lngN = parse(lng, 180);

  const commitName = (v: string) => {
    setName(v);
    if (v.trim()) updateWaypoint(waypoint.id, { name: v });
  };
  const commitLat = (v: string) => {
    setLat(v);
    const n = parse(v, 90);
    if (n != null) updateWaypoint(waypoint.id, { position: { ...waypoint.position, lat: n } });
  };
  const commitLng = (v: string) => {
    setLng(v);
    const n = parse(v, 180);
    if (n != null) updateWaypoint(waypoint.id, { position: { ...waypoint.position, lng: n } });
  };
  const commitAlt = (v: string) => {
    setAlt(v);
    const n = v.trim() === '' ? undefined : parse(v);
    if (n !== null) updateWaypoint(waypoint.id, { altitudeFt: n });
  };

  const field = { size: 'small' as const };

  return (
    <Stack direction="row" spacing={1.25} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <TextField
        {...field}
        label="Name"
        value={name}
        onChange={(e) => commitName(e.target.value)}
        sx={{ flex: '2 1 12rem' }}
      />
      <TextField
        {...field}
        label="Latitude"
        value={lat}
        error={latN == null}
        onChange={(e) => commitLat(e.target.value)}
        sx={{ flex: '1 1 8.5rem' }}
      />
      <TextField
        {...field}
        label="Longitude"
        value={lng}
        error={lngN == null}
        onChange={(e) => commitLng(e.target.value)}
        sx={{ flex: '1 1 8.5rem' }}
      />
      <TextField
        {...field}
        label="Altitude (ft)"
        value={alt}
        placeholder="optional"
        onChange={(e) => commitAlt(e.target.value)}
        sx={{ flex: '1 1 8rem' }}
      />
    </Stack>
  );
};

export default WaypointDetailsEditor;
