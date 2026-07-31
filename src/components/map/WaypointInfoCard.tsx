import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import BoltIcon from '@mui/icons-material/Bolt';
import { colors } from '@/theme/tokens';
import { MONO, MUTED, FAINT, fmtLb, fmtMinSec } from '@/components/shared/hudStyle';
import { useRouteBuilder } from '@/route/RouteBuilderContext';
import { actionDef } from '@/route/actionCatalog';
import type { LegCalc } from '@/calc/types';
import type { BuilderWaypoint } from '@/route/routeBuilderTypes';

type Tab = 'details' | 'actions';

const toInt = (raw: string): number | undefined => {
  if (raw.trim() === '') return undefined;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : undefined;
};

// A labelled mono value for the read-only leg strip.
const Field = ({ label, value, color = colors.white }: { label: string; value: string; color?: string }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: 0 }}>
    <Box sx={{ fontSize: 9, letterSpacing: '0.04em', textTransform: 'uppercase', color: MUTED }}>{label}</Box>
    <Box sx={{ fontFamily: MONO, fontSize: 12.5, color, fontVariantNumeric: 'tabular-nums' }}>{value}</Box>
  </Box>
);

// A right-aligned unit label inside a field.
const unit = (text: string) => ({
  endAdornment: (
    <InputAdornment position="end">
      <Box sx={{ fontSize: 11, color: FAINT }}>{text}</Box>
    </InputAdornment>
  ),
});

// Edit the waypoint's characteristics: name and altitude.
const DetailsPanel = ({ waypoint }: { waypoint: BuilderWaypoint }) => {
  const { updateWaypoint } = useRouteBuilder();
  const [name, setName] = useState(waypoint.name);
  const [alt, setAlt] = useState(waypoint.altitudeFt != null ? String(waypoint.altitudeFt) : '');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, p: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.14)', bgcolor: 'rgba(255,255,255,0.03)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <TuneIcon sx={{ fontSize: 16, color: colors.accent }} />
        <Box sx={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: colors.white }}>Details</Box>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 0.75 }}>
        <TextField
          size="small"
          label="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (e.target.value.trim()) updateWaypoint(waypoint.id, { name: e.target.value });
          }}
          sx={{ minWidth: 0 }}
        />
        <TextField
          size="small"
          label="Altitude"
          value={alt}
          onChange={(e) => {
            setAlt(e.target.value);
            updateWaypoint(waypoint.id, { altitudeFt: toInt(e.target.value) });
          }}
          slotProps={{ input: unit('ft') }}
          sx={{ minWidth: 0 }}
        />
      </Box>
    </Box>
  );
};

// Manage the waypoint's actions (hover today, more to come).
const ActionsPanel = ({ waypoint }: { waypoint: BuilderWaypoint }) => {
  const { addAction, updateAction, removeAction } = useRouteBuilder();
  const def = actionDef('hover');
  const hover = (waypoint.actions ?? []).find((a) => a.type === 'hover');

  if (!hover) {
    return (
      <Button
        fullWidth
        size="small"
        variant="outlined"
        color="primary"
        startIcon={<def.Icon sx={{ fontSize: 16 }} />}
        onClick={() => addAction(waypoint.id, 'hover')}
      >
        Add Hover
      </Button>
    );
  }

  const p = hover.params ?? {};
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, p: '8px', borderRadius: '8px', border: `1px solid ${def.color}55`, bgcolor: `${def.color}12` }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <def.Icon sx={{ fontSize: 16, color: def.color }} />
        <Box sx={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: colors.white }}>{def.label}</Box>
        <IconButton size="small" aria-label="Remove hover" onClick={() => removeAction(waypoint.id, hover.id)} sx={{ color: colors.brown, '&:hover': { color: colors.red } }}>
          <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.75 }}>
        <TextField
          size="small"
          label="Duration"
          value={p.durationSec ?? ''}
          onChange={(e) => updateAction(waypoint.id, hover.id, { durationSec: toInt(e.target.value) })}
          slotProps={{ input: unit('s') }}
          sx={{ minWidth: 0 }}
        />
        <TextField
          size="small"
          label="Altitude"
          value={p.altitudeFt ?? ''}
          onChange={(e) => updateAction(waypoint.id, hover.id, { altitudeFt: toInt(e.target.value) })}
          slotProps={{ input: unit('ft') }}
          sx={{ minWidth: 0 }}
        />
      </Box>
    </Box>
  );
};

// Expanded tooltip: a read-only leg strip plus Details / Actions tabs to edit inline.
const WaypointInfoCard = ({
  waypoint,
  isStart,
  leg,
}: {
  waypoint: BuilderWaypoint;
  isStart: boolean;
  leg?: LegCalc;
}) => {
  const [tab, setTab] = useState<Tab>('details');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: '2px', pt: 1, mt: '2px', width: 260, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2.5, px: '2px' }}>
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

      <ToggleButtonGroup
        exclusive
        fullWidth
        value={tab}
        onChange={(_, v: Tab | null) => v && setTab(v)}
        sx={{
          '& .MuiToggleButton-root': {
            py: '4px',
            gap: '5px',
            textTransform: 'none',
            letterSpacing: 0,
            fontSize: 12.5,
            fontWeight: 600,
            color: MUTED,
            border: '1px solid rgba(255,255,255,0.12)',
          },
          '& .Mui-selected': {
            color: `${colors.accent} !important`,
            bgcolor: `${colors.accent}1f !important`,
            borderColor: `${colors.accent}66 !important`,
          },
        }}
      >
        <ToggleButton value="details">
          <TuneIcon sx={{ fontSize: 15 }} />
          Details
        </ToggleButton>
        <ToggleButton value="actions">
          <BoltIcon sx={{ fontSize: 15 }} />
          Actions
        </ToggleButton>
      </ToggleButtonGroup>

      {tab === 'details' ? <DetailsPanel waypoint={waypoint} /> : <ActionsPanel waypoint={waypoint} />}
    </Box>
  );
};

export default WaypointInfoCard;
