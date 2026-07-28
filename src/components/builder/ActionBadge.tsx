import Box from '@mui/material/Box';
import { MONO } from '@/components/shared/hudStyle';
import { actionDef } from '@/route/actionCatalog';
import type { WaypointActionType } from '@/route/routeBuilderTypes';

interface ActionBadgeProps {
  type: WaypointActionType;
  onMap?: boolean;
}

// Catalog-driven action badge: colored icon plus short code.
const ActionBadge = ({ type, onMap = false }: ActionBadgeProps) => {
  const def = actionDef(type);
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        px: '5px',
        py: '2px',
        borderRadius: '5px',
        fontFamily: MONO,
        fontSize: onMap ? 10 : 9,
        letterSpacing: '0.06em',
        fontWeight: 600,
        color: def.color,
        bgcolor: onMap ? 'rgba(16,17,19,0.92)' : `${def.color}1f`,
        border: `1px solid ${def.color}${onMap ? '99' : '66'}`,
        whiteSpace: 'nowrap',
      }}
    >
      <def.Icon sx={{ fontSize: onMap ? 12 : 11 }} />
      <span>{def.short}</span>
    </Box>
  );
};

export default ActionBadge;
