import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import { MUTED, FAINT } from '@/components/hud/hudStyle';
import { useRouteBuilder } from '@/route/RouteBuilderContext';
import WaypointChip from '@/components/builder/WaypointChip';
import WaypointActionsEditor from '@/components/builder/WaypointActionsEditor';

/** Shared section-header style: readable sans, muted, gentle spacing. */
const sectionLabelSx = {
  fontSize: 10.5,
  fontWeight: 600,
  letterSpacing: '0.05em',
  textTransform: 'uppercase' as const,
  color: MUTED,
  mb: 0.75,
};

/** Parses a coordinate field; returns null if not a finite number in range. */
const parseCoord = (raw: string, max: number): number | null => {
  const n = Number(raw);
  return Number.isFinite(n) && Math.abs(n) <= max ? n : null;
};

const AddWaypointForm = () => {
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
    addWaypoint({ lat: latN, lng: lngN }, name, Number.isFinite(altN) ? altN : undefined);
    setLat('');
    setLng('');
    setName('');
    setAlt('');
  };

  const field = { sx: { width: '6.5rem' }, size: 'small' as const };

  return (
    <Stack
      direction="row"
      spacing={1}
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      useFlexGap
      sx={{ alignItems: 'center', flexWrap: 'wrap' }}
    >
      <TextField {...field} label="Lat" value={lat} onChange={(e) => setLat(e.target.value)} error={lat !== '' && latN == null} />
      <TextField {...field} label="Lng" value={lng} onChange={(e) => setLng(e.target.value)} error={lng !== '' && lngN == null} />
      <TextField {...field} sx={{ width: '9rem' }} label="Name (opt)" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField {...field} sx={{ width: '6rem' }} label="Alt ft (opt)" value={alt} onChange={(e) => setAlt(e.target.value)} />
      <Button type="submit" variant="contained" color="primary" startIcon={<AddIcon />} disabled={!valid}>
        Add
      </Button>
    </Stack>
  );
};

/** The route builder: add waypoints by lat/lng, reorder by drag, select to act. */
const RouteBuilderPanel = () => {
  const { route, selectedWaypointId, selectWaypoint, removeWaypoint, moveWaypoint } =
    useRouteBuilder();

  // A small drag threshold so clicking a chip to select doesn't start a drag.
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = route.waypoints.findIndex((w) => w.id === active.id);
    const to = route.waypoints.findIndex((w) => w.id === over.id);
    if (from >= 0 && to >= 0) moveWaypoint(from, to);
  };

  return (
    <Stack spacing={1.25} sx={{ p: 0.5 }}>
      <AddWaypointForm />

      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.08)', pt: 1 }}>
        <Typography sx={sectionLabelSx}>Route Order — drag to reorder</Typography>

        {route.waypoints.length === 0 ? (
          <Typography variant="caption" sx={{ color: MUTED }}>
            No waypoints yet — add one above.
          </Typography>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={route.waypoints.map((w) => w.id)} strategy={horizontalListSortingStrategy}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                {route.waypoints.map((wp, index) => (
                  <Box key={wp.id} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <WaypointChip
                      waypoint={wp}
                      index={index}
                      selected={wp.id === selectedWaypointId}
                      onSelect={() => selectWaypoint(wp.id)}
                      onRemove={() => removeWaypoint(wp.id)}
                    />
                    {index < route.waypoints.length - 1 && (
                      <Box sx={{ color: FAINT }}>→</Box>
                    )}
                  </Box>
                ))}
              </Box>
            </SortableContext>
          </DndContext>
        )}
      </Box>

      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.08)', pt: 1 }}>
        <Typography sx={sectionLabelSx}>Waypoint Actions</Typography>
        <WaypointActionsEditor />
      </Box>
    </Stack>
  );
};

export default RouteBuilderPanel;
