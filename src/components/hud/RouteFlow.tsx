import Box from '@mui/material/Box';
import { colors } from '@/theme/tokens';
import type { LegCalc, RouteCalculation } from '@/calc/types';
import type { BuilderRoute, BuilderWaypoint, WaypointActionType } from '@/route/routeBuilderTypes';
import { actionDef } from '@/route/actionCatalog';
import { MONO, MUTED, FAINT, fmtLb, fmtMinSec, fmtNm } from '@/components/shared/hudStyle';

// A small icon indicator for a waypoint action.
const ActionPip = ({ type }: { type: WaypointActionType }) => {
  const def = actionDef(type);
  return (
    <Box
      title={def.label}
      sx={{ display: 'inline-flex', p: '2px', borderRadius: '4px', bgcolor: `${def.color}22`, border: `1px solid ${def.color}77` }}
    >
      <def.Icon sx={{ fontSize: 12, color: def.color }} />
    </Box>
  );
};

// A waypoint marker in the flow: diamond, index, and action indicators.
const WaypointNode = ({
  waypoint,
  index,
  isEndpoint,
}: {
  waypoint: BuilderWaypoint;
  index: number;
  isEndpoint: boolean;
}) => {
  const actions = waypoint.actions ?? [];
  const active = actions.length > 0;
  const accent = active ? colors.accent : isEndpoint ? colors.gold : colors.brown;

  return (
    <Box sx={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', px: '1px' }}>
      <Box
        sx={{
          width: 12,
          height: 12,
          transform: 'rotate(45deg)',
          borderRadius: '2px',
          border: `2px solid ${accent}`,
          bgcolor: active ? accent : 'rgba(16,17,19,0.9)',
          boxShadow: active ? `0 0 9px ${accent}77` : 'none',
        }}
      />
      <Box sx={{ fontFamily: MONO, fontSize: 10, color: active ? colors.white : MUTED }}>
        {String(index + 1).padStart(2, '0')}
      </Box>
      {active && (
        <Box sx={{ display: 'flex', gap: '3px' }}>
          {actions.map((a) => (
            <ActionPip key={a.id} type={a.type} />
          ))}
        </Box>
      )}
    </Box>
  );
};

// A centered label-over-value stat within a leg tile.
const Stat = ({ label, value, unit, color = colors.white }: { label: string; value: string; unit?: string; color?: string }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px', minWidth: 0 }}>
    <Box sx={{ fontSize: 9, letterSpacing: '0.04em', color: MUTED, textTransform: 'uppercase' }}>{label}</Box>
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '2px', fontFamily: MONO }}>
      <Box sx={{ fontSize: 13, color, fontVariantNumeric: 'tabular-nums' }}>{value}</Box>
      {unit && <Box sx={{ fontSize: 8.5, color: FAINT }}>{unit}</Box>}
    </Box>
  </Box>
);

// A fixed-width leg info tile: time, distance, and fuel for the segment.
const LegTile = ({ leg }: { leg: LegCalc }) => (
  <Box
    sx={{
      flex: '0 0 auto',
      width: 168,
      borderRadius: '8px',
      overflow: 'hidden',
      bgcolor: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.1)',
    }}
  >
    <Box
      sx={{
        px: '8px',
        py: '2px',
        fontFamily: MONO,
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: '0.06em',
        color: colors.accent,
        bgcolor: `${colors.accent}14`,
        borderBottom: `1px solid ${colors.accent}38`,
      }}
    >
      LEG {leg.index + 1}
    </Box>
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', alignItems: 'baseline', px: '5px', py: '5px' }}>
      <Stat label="Time" value={fmtMinSec(leg.legTimeMin)} />
      <Stat label="Dist" value={fmtNm(leg.distanceNm)} unit="nm" />
      <Stat label="Fuel" value={fmtLb(leg.legFuelLb)} unit="lb" color={colors.gold} />
    </Box>
  </Box>
);

// Tightly packed waypoint/leg flow that wraps to new rows as the route grows.
// Each waypoint stays paired with its outgoing leg so pairs never split.
const RouteFlow = ({ route, calc }: { route: BuilderRoute; calc: RouteCalculation }) => {
  const lastIndex = route.waypoints.length - 1;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '6px', rowGap: '8px' }}>
      {route.waypoints.map((wp, i) => (
        <Box key={wp.id} sx={{ display: 'flex', alignItems: 'center', gap: '6px', flex: '0 0 auto' }}>
          <WaypointNode waypoint={wp} index={i} isEndpoint={i === 0 || i === lastIndex} />
          {calc.legs[i] && <LegTile leg={calc.legs[i]} />}
        </Box>
      ))}
    </Box>
  );
};

export default RouteFlow;
