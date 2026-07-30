import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { colors } from '@/theme/tokens';
import { MONO } from '@/components/shared/hudStyle';
import type { BuilderWaypoint } from '@/route/routeBuilderTypes';

interface RouteChipProps {
  waypoint: BuilderWaypoint;
  index: number;
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

// A draggable, selectable waypoint token shown inline inside the route bar.
const RouteChip = ({ waypoint, index, selected, onSelect, onRemove }: RouteChipProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: waypoint.id,
  });

  const hasActions = (waypoint.actions?.length ?? 0) > 0;
  const accent = hasActions ? colors.accent : colors.gold;

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onSelect}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        pl: '7px',
        pr: '5px',
        py: '5px',
        borderRadius: '9px',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        bgcolor: selected ? `${accent}26` : 'rgba(255,255,255,0.05)',
        border: `1px solid ${selected ? accent : 'rgba(255,255,255,0.12)'}`,
        opacity: isDragging ? 0.4 : 1,
        transition: 'background-color 120ms ease, border-color 120ms ease',
        '&:hover': { borderColor: accent },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 20,
          height: 20,
          px: '5px',
          borderRadius: '6px',
          flexShrink: 0,
          fontFamily: MONO,
          fontSize: 12,
          fontWeight: 700,
          lineHeight: 1,
          color: colors.black,
          bgcolor: accent,
          boxShadow: selected ? `0 0 0 2px ${accent}55` : 'none',
        }}
      >
        {index + 1}
      </Box>
      <Box sx={{ fontFamily: MONO, fontSize: 14, fontWeight: 600, color: colors.white }}>
        {waypoint.name}
      </Box>
      <Box
        component="span"
        role="button"
        aria-label={`Remove ${waypoint.name}`}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        sx={{
          display: 'flex',
          cursor: 'pointer',
          color: colors.brown,
          borderRadius: '4px',
          p: '1px',
          '&:hover': { color: colors.red },
        }}
      >
        <CloseIcon sx={{ fontSize: 16 }} />
      </Box>
    </Box>
  );
};

export default RouteChip;
