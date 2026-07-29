import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { colors } from '@/theme/tokens';
import { MONO, MUTED, FAINT, fmtLb, fmtMinSec } from '@/components/shared/hudStyle';
import { useRouteBuilder } from '@/route/RouteBuilderContext';
import { actionDef } from '@/route/actionCatalog';
import type { LegCalc } from '@/calc/types';
import type { BuilderWaypoint } from '@/route/routeBuilderTypes';

const toInt = (raw: string): number | undefined => {
  if (raw.trim() === '') return undefined;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : undefined;
};

// A labelled mono value.
const Field = ({ label, value, color = colors.white }: { label: string; value: string; color?: string }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: 0 }}>
    <Box sx={{ fontSize: 9, letterSpacing: '0.04em', textTransform: 'uppercase', color: MUTED }}>{label}</Box>
    <Box sx={{ fontFamily: MONO, fontSize: 12.5, color, fontVariantNumeric: 'tabular-nums' }}>{value}</Box>
  </Box>
);

// Add / remove the Hover action and edit its parameters, from the tooltip.
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
        startIcon={<def.Icon sx={{ fontSize: 15 }} />}
        onClick={() => addAction(waypoint.id, 'hover')}
        sx={{ alignSelf: 'flex-start' }}
      >
        Add Hover
      </Button>
    );
  }

  const p = hover.params ?? {};
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, p: '6px', borderRadius: '7px', border: `1px solid ${def.color}55`, bgcolor: `${def.color}12` }}>
      <def.Icon sx={{ fontSize: 15, color: def.color, flex: '0 0 auto' }} />
      <TextField
        size="small"
        label="Time (s)"
        value={p.durationSec ?? ''}
        onChange={(e) => updateAction(waypoint.id, hover.id, { durationSec: toInt(e.target.value) })}
        sx={{ width: '5rem' }}
      />
      <TextField
        size="small"
        label="Alt (ft)"
        value={p.altitudeFt ?? ''}
        onChange={(e) => updateAction(waypoint.id, hover.id, { altitudeFt: toInt(e.target.value) })}
        sx={{ width: '5rem' }}
      />
      <IconButton size="small" aria-label="Remove hover" onClick={() => removeAction(waypoint.id, hover.id)} sx={{ color: colors.brown, ml: 'auto', '&:hover': { color: colors.red } }}>
        <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );
};

// Expanded tooltip content: altitude, inbound-leg readout, and actions.
const WaypointInfoCard = ({
  waypoint,
  isStart,
  leg,
}: {
  waypoint: BuilderWaypoint;
  isStart: boolean;
  leg?: LegCalc;
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: '2px', pt: 1, mt: '2px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2.5 }}>
      <Field label="Alt" value={`${(waypoint.altitudeFt ?? 0).toLocaleString()} ft`} />
      {leg ? (
        <>
          <Field label="Time" value={fmtMinSec(leg.legTimeMin)} />
          <Field label="Fuel" value={`${fmtLb(leg.legFuelLb)} lb`} color={colors.gold} />
        </>
      ) : (
        isStart && <Box sx={{ fontSize: 10.5, letterSpacing: '0.05em', textTransform: 'uppercase', color: FAINT }}>Route start</Box>
      )}
    </Box>

    <HoverEditor waypoint={waypoint} />
  </Box>
);

export default WaypointInfoCard;
