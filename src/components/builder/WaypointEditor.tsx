import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { colors } from '@/theme/tokens';
import { MONO, FAINT } from '@/components/shared/hudStyle';
import { useRouteBuilder } from '@/route/RouteBuilderContext';
import { actionDef } from '@/route/actionCatalog';
import WaypointDetailsEditor from '@/components/builder/WaypointDetailsEditor';
import type { BuilderWaypoint } from '@/route/routeBuilderTypes';

const toInt = (raw: string): number | undefined => {
  if (raw.trim() === '') return undefined;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : undefined;
};

// Inline add/remove + parameter editor for a waypoint's Hover action.
const HoverEditor = ({ waypoint }: { waypoint: BuilderWaypoint }) => {
  const { addAction, updateAction, removeAction } = useRouteBuilder();
  const def = actionDef('hover');
  const hover = (waypoint.actions ?? []).find((a) => a.type === 'hover');

  if (!hover) {
    return (
      <Button
        size="small"
        variant="outlined"
        color="primary"
        startIcon={<def.Icon sx={{ fontSize: 16 }} />}
        onClick={() => addAction(waypoint.id, 'hover')}
        sx={{ alignSelf: 'flex-start' }}
      >
        Add Hover
      </Button>
    );
  }

  const p = hover.params ?? {};
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, p: 1, borderRadius: '8px', border: `1px solid ${def.color}55`, bgcolor: `${def.color}12` }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', color: def.color, fontSize: 12.5, fontWeight: 600 }}>
        <def.Icon sx={{ fontSize: 16 }} />
        Hover
      </Box>
      <Box sx={{ flex: 1 }} />
      <TextField
        size="small"
        label="Time (s)"
        value={p.durationSec ?? ''}
        onChange={(e) => updateAction(waypoint.id, hover.id, { durationSec: toInt(e.target.value) })}
        sx={{ width: '6rem' }}
      />
      <TextField
        size="small"
        label="Alt (ft)"
        value={p.altitudeFt ?? ''}
        onChange={(e) => updateAction(waypoint.id, hover.id, { altitudeFt: toInt(e.target.value) })}
        sx={{ width: '6rem' }}
      />
      <IconButton size="small" aria-label="Remove hover" onClick={() => removeAction(waypoint.id, hover.id)} sx={{ color: colors.brown, '&:hover': { color: colors.red } }}>
        <DeleteOutlinedIcon sx={{ fontSize: 17 }} />
      </IconButton>
    </Box>
  );
};

// The editor panel for the selected waypoint: full details plus its actions.
const WaypointEditor = () => {
  const { route, selectedWaypointId, removeWaypoint } = useRouteBuilder();
  const waypoint = route.waypoints.find((w) => w.id === selectedWaypointId);

  if (!waypoint) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 2,
          borderRadius: '11px',
          border: '1px dashed rgba(255,255,255,0.12)',
          color: FAINT,
          fontSize: 12.5,
        }}
      >
        Select a waypoint above to edit its details and actions.
      </Box>
    );
  }

  const index = route.waypoints.indexOf(waypoint);
  const actions = waypoint.actions ?? [];
  const accent = actions.length ? colors.accent : colors.gold;

  return (
    <Box sx={{ borderRadius: '11px', border: `1px solid ${colors.accent}44`, bgcolor: 'rgba(255,255,255,0.03)', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, bgcolor: `${colors.accent}12`, borderBottom: `1px solid ${colors.accent}30` }}>
        <Box sx={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: colors.black, bgcolor: accent, borderRadius: '4px', px: '6px', py: '2px' }}>
          {String(index + 1).padStart(2, '0')}
        </Box>
        <Typography sx={{ flex: 1, fontSize: 14, fontWeight: 600, color: colors.white }} noWrap>
          {waypoint.name}
        </Typography>
        <Button
          size="small"
          color="error"
          startIcon={<DeleteOutlinedIcon sx={{ fontSize: 17 }} />}
          onClick={() => removeWaypoint(waypoint.id)}
        >
          Remove
        </Button>
      </Box>

      <Stack spacing={1.5} sx={{ p: 1.5 }}>
        <Box>
          <Typography sx={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: FAINT, mb: 0.75 }}>
            Details
          </Typography>
          <WaypointDetailsEditor key={waypoint.id} waypoint={waypoint} />
        </Box>
        <Box>
          <Typography sx={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: FAINT, mb: 0.75 }}>
            Actions
          </Typography>
          <HoverEditor waypoint={waypoint} />
        </Box>
      </Stack>
    </Box>
  );
};

export default WaypointEditor;
