import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { MUTED } from '@/components/shared/hudStyle';
import { useRouteBuilder } from '@/route/RouteBuilderContext';
import WaypointChip from '@/components/builder/WaypointChip';
import WaypointDetailsEditor from '@/components/builder/WaypointDetailsEditor';
import WaypointActionsEditor from '@/components/builder/WaypointActionsEditor';

const sectionLabelSx = {
  fontSize: 10.5,
  fontWeight: 600,
  letterSpacing: '0.05em',
  textTransform: 'uppercase' as const,
  color: MUTED,
  mb: 0.75,
};

// Route builder: reorder waypoints by drag and edit the selected one.
const RouteBuilderPanel = () => {
  const { route, selectedWaypointId, selectWaypoint, removeWaypoint, moveWaypoint } =
    useRouteBuilder();

  const selectedWaypoint = route.waypoints.find((w) => w.id === selectedWaypointId) ?? null;

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
      <Box>
        <Typography sx={sectionLabelSx}>Route Order — drag to reorder</Typography>

        {route.waypoints.length === 0 ? (
          <Typography variant="caption" sx={{ color: MUTED }}>
            No waypoints yet — add one in Waypoint Creator.
          </Typography>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={route.waypoints.map((w) => w.id)} strategy={rectSortingStrategy}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, flexWrap: 'wrap' }}>
                {route.waypoints.map((wp, index) => (
                  <WaypointChip
                    key={wp.id}
                    waypoint={wp}
                    index={index}
                    selected={wp.id === selectedWaypointId}
                    showArrow={index < route.waypoints.length - 1}
                    onSelect={() => selectWaypoint(wp.id)}
                    onRemove={() => removeWaypoint(wp.id)}
                  />
                ))}
              </Box>
            </SortableContext>
          </DndContext>
        )}
      </Box>

      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.08)', pt: 1 }}>
        <Typography sx={sectionLabelSx}>Waypoint Details</Typography>
        {selectedWaypoint ? (
          <WaypointDetailsEditor key={selectedWaypoint.id} waypoint={selectedWaypoint} />
        ) : (
          <Typography variant="caption" sx={{ color: MUTED }}>
            Select a waypoint to edit its details.
          </Typography>
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
