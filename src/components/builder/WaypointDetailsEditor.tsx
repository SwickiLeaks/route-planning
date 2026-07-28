import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { MUTED } from '@/components/hud/hudStyle';
import { useRouteBuilder } from '@/route/RouteBuilderContext';
import type { BuilderWaypoint } from '@/route/routeBuilderTypes';

const parse = (raw: string, max?: number): number | null => {
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  if (max != null && Math.abs(n) > max) return null;
  return n;
};

const labelSx = {
  fontSize: 12,
  fontWeight: 600,
  color: MUTED,
  textAlign: 'right' as const,
  whiteSpace: 'nowrap' as const,
  alignSelf: 'center' as const,
};

/**
 * Edits the selected waypoint's details live. Remounted per waypoint (via key)
 * so the fields seed from the current values; edits flow straight to the store.
 */
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

  const field = { size: 'small' as const, fullWidth: true };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto 1fr',
        columnGap: 1.5,
        rowGap: 1.25,
        alignItems: 'center',
        maxWidth: 640,
      }}
    >
      <Box sx={labelSx}>Name</Box>
      <Box sx={{ gridColumn: 'span 3' }}>
        <TextField {...field} value={name} onChange={(e) => commitName(e.target.value)} />
      </Box>

      <Box sx={labelSx}>Latitude</Box>
      <TextField {...field} value={lat} error={latN == null} onChange={(e) => commitLat(e.target.value)} />
      <Box sx={labelSx}>Longitude</Box>
      <TextField {...field} value={lng} error={lngN == null} onChange={(e) => commitLng(e.target.value)} />

      <Box sx={labelSx}>Altitude (ft)</Box>
      <TextField {...field} value={alt} placeholder="optional" onChange={(e) => commitAlt(e.target.value)} />
      <Box />
      <Box />
    </Box>
  );
};

export default WaypointDetailsEditor;
