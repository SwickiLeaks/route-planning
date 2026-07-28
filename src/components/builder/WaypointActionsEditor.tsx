import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { colors } from '@/theme/tokens';
import { MONO, MUTED } from '@/components/hud/hudStyle';
import { useRouteBuilder } from '@/route/RouteBuilderContext';
import { ACTION_CATALOG, actionDef } from '@/route/actionCatalog';
import type { WaypointAction } from '@/route/routeBuilderTypes';

/** Parses a numeric field to a number, or undefined when blank/invalid. */
const num = (raw: string): number | undefined => {
  if (raw.trim() === '') return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
};

/** An editable card for one placed action (Hover params shown inline). */
const ActionCard = ({
  waypointId,
  action,
}: {
  waypointId: string;
  action: WaypointAction;
}) => {
  const { updateAction, removeAction } = useRouteBuilder();
  const def = actionDef(action.type);
  const p = action.params ?? {};

  return (
    <Box
      sx={{
        borderRadius: '9px',
        border: `1px solid ${def.color}66`,
        bgcolor: `${def.color}12`,
        overflow: 'hidden',
        maxWidth: 360,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.25,
          py: 0.5,
          borderBottom: `1px solid ${def.color}33`,
        }}
      >
        <def.Icon sx={{ fontSize: 17, color: def.color }} />
        <Typography sx={{ flex: 1, fontSize: 13, fontWeight: 600, color: colors.white }}>
          {def.label}
        </Typography>
        <IconButton
          size="small"
          onClick={() => removeAction(waypointId, action.id)}
          aria-label={`Remove ${def.label}`}
          sx={{ color: colors.brown, p: '2px', '&:hover': { color: colors.red } }}
        >
          <CloseIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Box>

      {action.type === 'hover' && (
        <Stack direction="row" spacing={1.5} sx={{ px: 1.25, py: 1.25 }}>
          <TextField
            size="small"
            type="number"
            label="Duration"
            value={p.durationSec ?? ''}
            onChange={(e) => updateAction(waypointId, action.id, { durationSec: num(e.target.value) })}
            slotProps={{ input: { endAdornment: <Adorn>s</Adorn> } }}
            sx={{ width: '8rem' }}
          />
          <TextField
            size="small"
            type="number"
            label="Altitude"
            value={p.altitudeFt ?? ''}
            onChange={(e) => updateAction(waypointId, action.id, { altitudeFt: num(e.target.value) })}
            slotProps={{ input: { endAdornment: <Adorn>ft</Adorn> } }}
            sx={{ width: '8rem' }}
          />
        </Stack>
      )}
    </Box>
  );
};

const Adorn = ({ children }: { children: string }) => (
  <Box component="span" sx={{ fontSize: 11, color: MUTED, fontFamily: MONO }}>
    {children}
  </Box>
);

/** Actions for the selected waypoint: add actions and edit their parameters. */
const WaypointActionsEditor = () => {
  const { route, selectedWaypointId, addAction } = useRouteBuilder();
  const wp = route.waypoints.find((w) => w.id === selectedWaypointId);

  if (!wp) {
    return (
      <Typography variant="caption" sx={{ color: MUTED }}>
        Select a waypoint to add actions.
      </Typography>
    );
  }

  const actions = wp.actions ?? [];

  return (
    <Stack spacing={1.25}>
      <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: colors.white }}>{wp.name}</Typography>
        <Box sx={{ flex: 1 }} />
        {ACTION_CATALOG.map((def) => (
          <Button
            key={def.type}
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => addAction(wp.id, def.type)}
          >
            {def.label}
          </Button>
        ))}
      </Stack>

      {actions.length === 0 ? (
        <Typography variant="caption" sx={{ color: MUTED }}>
          No actions at this waypoint yet.
        </Typography>
      ) : (
        <Stack direction="row" spacing={1.25} useFlexGap sx={{ flexWrap: 'wrap' }}>
          {actions.map((a) => (
            <ActionCard key={a.id} waypointId={wp.id} action={a} />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default WaypointActionsEditor;
