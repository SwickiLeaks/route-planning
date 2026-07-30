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
        gap: '6px',
        pl: '6px',
        pr: '2px',
        py: '3px',
        borderRadius: '7px',
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
          width: 17,
          height: 17,
          borderRadius: '50%',
          flexShrink: 0,
          fontFamily: MONO,
          fontSize: 10,
          fontWeight: 700,
          lineHeight: 1,
          color: selected ? colors.black : accent,
          bgcolor: selected ? accent : `${accent}22`,
          border: `1px solid ${accent}${selected ? '' : '66'}`,
        }}
      >
        {index + 1}
      </Box>
      <Box sx={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: colors.white }}>
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
          color: colors.brown,
          borderRadius: '4px',
          p: '1px',
          '&:hover': { color: colors.red },
        }}
      >
        <CloseIcon sx={{ fontSize: 15 }} />
      </Box>
    </Box>
  );
};

export default RouteChip;
