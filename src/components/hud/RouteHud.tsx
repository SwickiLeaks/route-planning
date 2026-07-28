import Box from '@mui/material/Box';
import { colors } from '@/theme/tokens';
import type { LegCalc, RouteCalculation } from '@/calc/types';
import type { BuilderRoute, BuilderWaypoint, WaypointActionType } from '@/route/routeBuilderTypes';
import { actionDef } from '@/route/actionCatalog';
import {
  MONO,
  MUTED,
  FAINT,
  glassPane,
  fmtHrMin,
  fmtLb,
  fmtMinSec,
  fmtNm,
  fuelStateColor,
} from '@/components/shared/hudStyle';
import MetricTile from '@/components/hud/MetricTile';
import FuelConsumption from '@/components/hud/FuelConsumption';

interface RouteHudProps {
  route: BuilderRoute;
  calc: RouteCalculation;
  calculating?: boolean;
  faded?: boolean;
}

// A compact action indicator shown under a waypoint node.
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

// A waypoint node in the legs strip: diamond over index, plus action pips.
const Node = ({
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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: '0 0 auto', px: '2px' }}>
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
        <Box sx={{ display: 'flex', gap: '3px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 62 }}>
          {actions.map((a) => (
            <ActionPip key={a.id} type={a.type} />
          ))}
        </Box>
      )}
    </Box>
  );
};

// A centered label-over-value stat that spreads within its grid column.
const Stat = ({ label, value, unit, color = colors.white }: { label: string; value: string; unit?: string; color?: string }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', minWidth: 0 }}>
    <Box sx={{ fontSize: 9.5, letterSpacing: '0.05em', color: MUTED, textTransform: 'uppercase' }}>{label}</Box>
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '3px', fontFamily: MONO }}>
      <Box sx={{ fontSize: 14, color, fontVariantNumeric: 'tabular-nums' }}>{value}</Box>
      {unit && <Box sx={{ fontSize: 9, color: FAINT }}>{unit}</Box>}
    </Box>
  </Box>
);

// A leg card that grows to fill the row and wraps as legs add.
const Segment = ({ leg }: { leg: LegCalc }) => (
  <Box
    sx={{
      flex: 1,
      minWidth: 0,
      alignSelf: 'flex-start',
      borderRadius: '8px',
      overflow: 'hidden',
      bgcolor: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
    }}
  >
    <Box
      sx={{
        px: '9px',
        py: '3px',
        fontFamily: MONO,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.06em',
        color: colors.accent,
        bgcolor: `${colors.accent}14`,
        borderBottom: `1px solid ${colors.accent}40`,
      }}
    >
      LEG {leg.index + 1}
    </Box>
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', alignItems: 'baseline', px: '6px', py: '7px' }}>
      <Stat label="Time" value={fmtMinSec(leg.legTimeMin)} />
      <Stat label="Dist" value={fmtNm(leg.distanceNm)} unit="nm" />
      <Stat label="Fuel" value={fmtLb(leg.legFuelLb)} unit="lb" color={colors.gold} />
    </Box>
  </Box>
);

// Bottom HUD: a cluster of glass panes layered over the map.
const RouteHud = ({ route, calc, calculating = false, faded = false }: RouteHudProps) => {
  const t = calc.totals;
  const stateColor = fuelStateColor(t.fuelState);
  const lastIndex = route.waypoints.length - 1;

  const dim = {
    opacity: calculating ? 0.55 : 1,
    transition: 'opacity 200ms',
    animation: calculating ? 'hud-pulse 1.1s ease-in-out infinite' : 'none',
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 16,
        left: '50%',
        zIndex: 3,
        width: 'min(1320px, calc(100vw - 24px))',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        transform: `translateX(-50%) translateY(${faded ? 12 : 0}px)`,
        opacity: faded ? 0.12 : 1,
        pointerEvents: faded ? 'none' : 'auto',
        transition: `opacity ${faded ? 150 : 450}ms ease, transform ${faded ? 150 : 450}ms ease`,
      }}
    >
      {calculating && (
        <Box
          sx={{
            ...glassPane,
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            px: '11px',
            py: '4px',
            borderRadius: '20px',
          }}
        >
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: colors.accent, animation: 'hud-pulse 0.9s ease-in-out infinite' }} />
          <Box sx={{ fontSize: 10.5, letterSpacing: '0.06em', color: colors.accent }}>CALCULATING</Box>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', ...dim }}>
        <MetricTile label="Distance" value={fmtNm(t.distanceNm)} unit="nm" />
        <MetricTile label="Route Time" value={fmtHrMin(t.routeTimeMin)} unit="ete" accent={colors.accent} />
        <MetricTile label="Fuel Burn" value={fmtLb(t.routeFuelLb)} unit="lb" accent={colors.gold} />
        <MetricTile label="Remaining" value={fmtLb(t.remainingFuelLb)} unit="lb" accent={stateColor} />
        <MetricTile label="Avg Flow" value={fmtLb(t.avgFuelFlowLbHr)} unit="lb/hr" />
      </Box>

      <Box sx={{ ...glassPane, width: '100%', px: 1.5, py: 1.25, ...dim }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px', rowGap: '10px' }}>
          {route.waypoints.map((wp, i) => {
            const hasLeg = Boolean(calc.legs[i]);
            return (
              <Box
                key={wp.id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '6px',
                  flex: hasLeg ? '1 1 240px' : '0 0 auto',
                  minWidth: 0,
                }}
              >
                <Node waypoint={wp} index={i} isEndpoint={i === 0 || i === lastIndex} />
                {hasLeg && <Segment leg={calc.legs[i]} />}
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box sx={{ ...glassPane, width: '100%', px: 2, py: 1.25, ...dim }}>
        <FuelConsumption calc={calc} />
      </Box>
    </Box>
  );
};

export default RouteHud;
