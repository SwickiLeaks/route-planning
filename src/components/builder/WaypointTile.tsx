import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Box from '@mui/material/Box';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { colors } from '@/theme/tokens';
import { MONO } from '@/components/shared/hudStyle';
import { useRouteBuilder } from '@/route/RouteBuilderContext';
import { actionDef } from '@/route/actionCatalog';
import type { BuilderWaypoint } from '@/route/routeBuilderTypes';

// A compact draggable route chip; clicking it selects the waypoint to edit.
const WaypointTile = ({
  waypoint,
  index,
  isEndpoint,
}: {
  waypoint: BuilderWaypoint;
  index: number;
  isEndpoint: boolean;
}) => {
  const { selectWaypoint, selectedWaypointId } = useRouteBuilder();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: waypoint.id,
  });

  const actions = waypoint.actions ?? [];
  const active = actions.length > 0;
  const accent = active ? colors.accent : isEndpoint ? colors.gold : colors.brown;
  const selected = selectedWaypointId === waypoint.id;
  const def = actionDef('hover');

  return (
    <Box
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        flex: '0 0 auto',
        pr: '10px',
        borderRadius: '10px',
        bgcolor: selected ? `${colors.accent}18` : 'rgba(255,255,255,0.04)',
        border: `1px solid ${selected ? colors.accent : 'rgba(255,255,255,0.12)'}`,
        boxShadow: isDragging ? '0 10px 24px rgba(0,0,0,0.5)' : 'none',
        opacity: isDragging ? 0.85 : 1,
        zIndex: isDragging ? 1 : 'auto',
      }}
    >
      <Box
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        sx={{ display: 'flex', alignItems: 'center', alignSelf: 'stretch', pl: '3px', pr: '1px', color: colors.brown, cursor: 'grab', touchAction: 'none', '&:hover': { color: colors.white } }}
      >
        <DragIndicatorIcon sx={{ fontSize: 17 }} />
      </Box>

      <Box
        onClick={() => selectWaypoint(selected ? null : waypoint.id)}
        role="button"
        aria-label={`Edit ${waypoint.name}`}
        sx={{ display: 'flex', alignItems: 'center', gap: '7px', py: '6px', cursor: 'pointer', minWidth: 0 }}
      >
        <Box sx={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: colors.black, bgcolor: accent, borderRadius: '4px', px: '5px', py: '1px' }}>
          {String(index + 1).padStart(2, '0')}
        </Box>
        <Box sx={{ fontSize: 13, fontWeight: 500, color: colors.white, whiteSpace: 'nowrap', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {waypoint.name}
        </Box>
        {active && <def.Icon sx={{ fontSize: 14, color: colors.accent }} />}
      </Box>
    </Box>
  );
};

export default WaypointTile;
