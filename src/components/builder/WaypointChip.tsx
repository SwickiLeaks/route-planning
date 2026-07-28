import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CloseIcon from '@mui/icons-material/Close';
import { colors } from '@/theme/tokens';
import { MONO, MUTED } from '@/components/hud/hudStyle';
import ActionBadge from '@/components/builder/ActionBadge';
import type { BuilderWaypoint } from '@/route/routeBuilderTypes';

interface WaypointChipProps {
  waypoint: BuilderWaypoint;
  index: number;
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

/**
 * A route-order node: a small card with an index tab, name, coordinates, and a
 * dedicated actions row that grows as actions are added. Drag the handle to
 * reorder; click to select.
 */
const WaypointChip = ({
  waypoint,
  index,
  selected,
  onSelect,
  onRemove,
}: WaypointChipProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: waypoint.id });

  const actions = waypoint.actions ?? [];

  return (
    <Box
      ref={setNodeRef}
      onClick={onSelect}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        width: 172,
        cursor: 'pointer',
        borderRadius: '9px',
        bgcolor: selected ? `${colors.yellow}12` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${selected ? `${colors.yellow}` : 'rgba(255,255,255,0.1)'}`,
        boxShadow: selected ? `0 4px 16px rgba(0,0,0,0.4)` : 'none',
        opacity: isDragging ? 0.4 : 1,
        flex: '0 0 auto',
      }}
    >
      {/* Header: drag handle · index · name · remove. */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, pr: 0.25 }}>
        <Box
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          sx={{
            display: 'flex',
            alignItems: 'center',
            alignSelf: 'stretch',
            px: '2px',
            color: colors.brown,
            cursor: 'grab',
            touchAction: 'none',
            bgcolor: 'rgba(255,255,255,0.03)',
            '&:hover': { color: colors.white },
          }}
          aria-label="Drag to reorder"
        >
          <DragIndicatorIcon sx={{ fontSize: 15 }} />
        </Box>

        <Box
          sx={{
            fontFamily: MONO,
            fontSize: 11,
            fontWeight: 600,
            color: colors.black,
            bgcolor: selected ? colors.yellow : colors.gold,
            borderRadius: '4px',
            px: '5px',
            py: '1px',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </Box>

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            fontSize: 13,
            fontWeight: 500,
            color: colors.white,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            py: 0.5,
          }}
        >
          {waypoint.name}
        </Box>

        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remove ${waypoint.name}`}
          sx={{ color: colors.brown, p: '2px', '&:hover': { color: colors.red } }}
        >
          <CloseIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>

      {/* Coordinates. */}
      <Box
        sx={{
          px: '8px',
          pb: actions.length ? '3px' : '6px',
          fontFamily: MONO,
          fontSize: 10.5,
          color: MUTED,
        }}
      >
        {waypoint.position.lat.toFixed(3)}, {waypoint.position.lng.toFixed(3)}
      </Box>

      {/* Actions row — only present when the waypoint carries actions. */}
      {actions.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            px: '8px',
            pb: '6px',
            pt: '2px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {actions.map((a) => (
            <ActionBadge key={a.id} type={a.type} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default WaypointChip;
