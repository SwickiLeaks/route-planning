import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { colors } from '@/theme/tokens';
import { MONO, MUTED } from '@/components/hud/hudStyle';
import { useRouteBuilder } from '@/route/RouteBuilderContext';
import { ACTION_CATALOG, actionDef } from '@/route/actionCatalog';
import type { WaypointActionType } from '@/route/routeBuilderTypes';

/**
 * Editor for the selected waypoint's actions. An "Add Action" menu lists the
 * whole catalog (so it scales to any number of action types), and placed
 * actions show as a removable list.
 */
const WaypointActionsEditor = () => {
  const { route, selectedWaypointId, addAction, removeAction } = useRouteBuilder();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const wp = route.waypoints.find((w) => w.id === selectedWaypointId);

  if (!wp) {
    return (
      <Typography variant="caption" sx={{ color: MUTED }}>
        Select a waypoint to add actions.
      </Typography>
    );
  }

  const actions = wp.actions ?? [];

  const pick = (type: WaypointActionType) => {
    addAction(wp.id, type);
    setAnchor(null);
  };

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: colors.white }}>
          {wp.name}
        </Typography>
        <Typography sx={{ fontSize: 11, color: MUTED }}>
          {actions.length} action{actions.length === 1 ? '' : 's'}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          endIcon={<ExpandMoreIcon />}
          onClick={(e) => setAnchor(e.currentTarget)}
        >
          Add Action
        </Button>
        <Menu
          anchorEl={anchor}
          open={Boolean(anchor)}
          onClose={() => setAnchor(null)}
          slotProps={{ paper: { sx: { maxHeight: 320 } } }}
        >
          {ACTION_CATALOG.map((def) => (
            <MenuItem key={def.type} onClick={() => pick(def.type)} sx={{ gap: 1 }}>
              <ListItemIcon sx={{ color: def.color, minWidth: 'auto !important' }}>
                <def.Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText slotProps={{ primary: { sx: { fontFamily: MONO, fontSize: 13 } } }}>
                {def.label}
              </ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </Stack>

      {actions.length === 0 ? (
        <Typography variant="caption" sx={{ color: MUTED }}>
          No actions at this waypoint yet.
        </Typography>
      ) : (
        <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
          {actions.map((a) => {
            const def = actionDef(a.type);
            return (
              <Stack
                key={a.id}
                direction="row"
                spacing={0.5}
                sx={{
                  alignItems: 'center',
                  pl: 0.85,
                  pr: 0.25,
                  py: 0.3,
                  borderRadius: '7px',
                  border: `1px solid ${def.color}88`,
                  bgcolor: `${def.color}14`,
                }}
              >
                <def.Icon sx={{ fontSize: 15, color: def.color }} />
                <Typography sx={{ fontSize: 12.5, color: colors.white }}>
                  {def.label}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => removeAction(wp.id, a.id)}
                  aria-label={`Remove ${def.label}`}
                  sx={{ color: colors.brown, p: '1px', '&:hover': { color: colors.red } }}
                >
                  <CloseIcon sx={{ fontSize: 13 }} />
                </IconButton>
              </Stack>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};

export default WaypointActionsEditor;
