import { Fragment } from 'react';
import Box from '@mui/material/Box';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { colors } from '@/theme/tokens';
import type { LegCalc, RouteCalculation } from '@/calc/types';
import type { BuilderRoute, BuilderWaypoint, WaypointActionType } from '@/route/routeBuilderTypes';
import { actionDef } from '@/route/actionCatalog';
import { useRouteCalc } from '@/route/RouteCalcContext';
import { CalcPointAttribute } from '@/api/msnsvr/missionClient';
import { MONO, MUTED, FAINT, PENDING } from '@/components/shared/hudStyle';

// A small icon indicator for a waypoint action.
const ActionPip = ({ type }: { type: WaypointActionType }) => {
  const def = actionDef(type);
  return (
    <Box
      title={def.label}
      sx={{ display: 'inline-flex', p: '2px', borderRadius: '4px', bgcolor: `${def.color}22`, border: `1px solid ${def.color}77` }}
    >
      <def.Icon sx={{ fontSize: 11, color: def.color }} />
    </Box>
  );
};

// A centered label-over-value stat for a leg metric.
const Stat = ({ label, value, unit, color = colors.white }: { label: string; value: string; unit?: string; color?: string }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px', minWidth: 0 }}>
    <Box sx={{ fontSize: 9, letterSpacing: '0.04em', color: MUTED, textTransform: 'uppercase' }}>{label}</Box>
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '2px', fontFamily: MONO }}>
      <Box sx={{ fontSize: 13, color, fontVariantNumeric: 'tabular-nums' }}>{value}</Box>
      {unit && <Box sx={{ fontSize: 8.5, color: FAINT }}>{unit}</Box>}
    </Box>
  </Box>
);

// The route-start triangle or a stop circle, colored by waypoint state.
const Shape = ({ start, color }: { start: boolean; color: string }) =>
  start ? (
    <Box component="svg" viewBox="0 0 12 12" sx={{ width: 11, height: 11, flex: '0 0 auto' }}>
      <polygon points="6,1 11,11 1,11" fill={color} />
    </Box>
  ) : (
    <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: color, flex: '0 0 auto' }} />
  );

// A combined tile: the waypoint plus the leg that arrives at it (none at origin).
const PointTile = ({
  waypoint,
  index,
  isEndpoint,
  leg,
  legTime,
  legDist,
}: {
  waypoint: BuilderWaypoint;
  index: number;
  isEndpoint: boolean;
  leg?: LegCalc;
  legTime?: string;
  legDist?: string;
}) => {
  const actions = waypoint.actions ?? [];
  const active = actions.length > 0;
  const isStart = index === 0;
  const accent = active ? colors.accent : isEndpoint ? colors.gold : colors.brown;

  return (
    <Box
      sx={{
        width: 172,
        flex: '0 0 auto',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '9px',
        overflow: 'hidden',
        bgcolor: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px', px: '9px', py: '5px', bgcolor: `${accent}14`, borderBottom: `1px solid ${accent}38` }}>
        <Shape start={isStart} color={accent} />
        <Box sx={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: active ? colors.white : MUTED }}>
          {String(index + 1).padStart(2, '0')}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, fontSize: 12.5, fontWeight: 500, color: colors.white, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {waypoint.name}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', px: '9px', pt: '5px' }}>
        <Box sx={{ fontFamily: MONO, fontSize: 10.5, color: MUTED }}>
          {waypoint.altitudeFt != null ? (
            <>
              {waypoint.altitudeFt.toLocaleString()}
              <Box component="span" sx={{ color: FAINT, ml: '2px' }}>ft</Box>
            </>
          ) : (
            PENDING
          )}
        </Box>
        {active && (
          <Box sx={{ display: 'flex', gap: '3px' }}>
            {actions.map((a) => (
              <ActionPip key={a.id} type={a.type} />
            ))}
          </Box>
        )}
      </Box>

      {leg ? (
        <Box sx={{ mt: '5px', pt: '5px', px: '5px', pb: '6px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', alignItems: 'baseline' }}>
          <Stat label="Time" value={legTime ?? PENDING} />
          <Stat label="Dist" value={legDist ?? PENDING} />
          <Stat label="Fuel" value={PENDING} unit="lb" color={colors.gold} />
        </Box>
      ) : (
        <Box sx={{ flex: 1, mt: '5px', pt: '5px', pb: '6px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: FAINT }}>
          Route start
        </Box>
      )}
    </Box>
  );
};

// A directional guide drawn between consecutive tiles.
const FlowArrow = () => (
  <Box sx={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', color: colors.accent, opacity: 0.55 }}>
    <ArrowRightAltIcon sx={{ fontSize: 24 }} />
  </Box>
);

// Wrapping flow of combined point/leg tiles; each tile owns its inbound leg.
const RouteFlow = ({ route, calc }: { route: BuilderRoute; calc: RouteCalculation }) => {
  const lastIndex = route.waypoints.length - 1;
  const { value } = useRouteCalc();

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', justifyContent: 'flex-start', gap: '6px', rowGap: '8px' }}>
      {route.waypoints.map((wp, i) => (
        <Fragment key={wp.id}>
          <PointTile
            waypoint={wp}
            index={i}
            isEndpoint={i === 0 || i === lastIndex}
            leg={calc.legs[i - 1]}
            legTime={value(wp.id, CalcPointAttribute.LegTime)}
            legDist={value(wp.id, CalcPointAttribute.LegDist)}
          />
          {i < lastIndex && <FlowArrow />}
        </Fragment>
      ))}
    </Box>
  );
};

export default RouteFlow;
