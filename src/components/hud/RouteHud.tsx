import { useState } from 'react';
import Box from '@mui/material/Box';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { colors } from '@/theme/tokens';
import type { RouteCalculation } from '@/calc/types';
import type { BuilderRoute } from '@/route/routeBuilderTypes';
import { MUTED, glassPane, PENDING } from '@/components/shared/hudStyle';
import MetricTile from '@/components/hud/MetricTile';
import RouteFlow from '@/components/hud/RouteFlow';
import { useRouteCalc } from '@/route/RouteCalcContext';
import { CalcPointAttribute } from '@/api/msnsvr/missionClient';

interface RouteHudProps {
  route: BuilderRoute;
  calc: RouteCalculation;
  calculating?: boolean;
  faded?: boolean;
}

// Grabber pill that collapses the HUD; shows a "Results" tab when hidden.
const HudHandle = ({
  collapsed,
  calculating,
  onToggle,
  faded,
}: {
  collapsed: boolean;
  calculating: boolean;
  onToggle: () => void;
  faded: boolean;
}) => (
  <Box
    role="button"
    aria-label={collapsed ? 'Show results' : 'Hide results'}
    aria-expanded={!collapsed}
    onClick={onToggle}
    sx={{
      ...glassPane,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      px: collapsed ? '13px' : '18px',
      py: collapsed ? '5px' : '2px',
      borderRadius: '20px',
      cursor: 'pointer',
      userSelect: 'none',
      color: MUTED,
      pointerEvents: faded ? 'none' : 'auto',
      transition: 'color 150ms, border-color 150ms, padding 200ms',
      '&:hover': { color: colors.white, borderColor: `${colors.accent}88` },
    }}
  >
    {collapsed ? (
      <>
        {calculating && (
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: colors.accent, animation: 'hud-pulse 0.9s ease-in-out infinite' }} />
        )}
        <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />
        <Box sx={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em' }}>RESULTS</Box>
      </>
    ) : (
      <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
    )}
  </Box>
);

// Bottom HUD: a cluster of glass panes layered over the map.
const RouteHud = ({ route, calc, calculating = false, faded = false }: RouteHudProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { total } = useRouteCalc();

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
        // Children opt into pointer events so the empty area over the map
        // (left when collapsed) stays click-through.
        pointerEvents: 'none',
        transform: `translateX(-50%) translateY(${faded ? 12 : 0}px)`,
        opacity: faded ? 0.12 : 1,
        transition: `opacity ${faded ? 150 : 450}ms ease, transform ${faded ? 150 : 450}ms ease`,
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'grid',
          // Collapse the row to zero height so it reserves no space (no page
          // overflow / scrollbar) while still animating open and closed.
          gridTemplateRows: collapsed ? '0fr' : '1fr',
          opacity: collapsed ? 0 : 1,
          // Stay click-through across the full width; only the content boxes below
          // opt back into pointer events, so the empty band doesn't block the map.
          pointerEvents: 'none',
          transition: 'grid-template-rows 380ms cubic-bezier(0.22, 1, 0.36, 1), opacity 260ms ease',
        }}
      >
        <Box
          sx={{
            overflow: 'hidden',
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
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

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', pointerEvents: faded || collapsed ? 'none' : 'auto', ...dim }}>
          <MetricTile label="Distance" value={total(CalcPointAttribute.RouteDistance) ?? PENDING} />
          <MetricTile label="Route Time" value={total(CalcPointAttribute.RouteTime) ?? PENDING} accent={colors.accent} />
          <MetricTile label="Fuel Burn" value={total(CalcPointAttribute.SegmentFuel) ?? PENDING} accent={colors.gold} />
          <MetricTile label="Remaining" value={PENDING} unit="lb" />
          <MetricTile label="Avg Flow" value={PENDING} unit="lb/hr" />
        </Box>

        <Box sx={{ ...glassPane, width: 'fit-content', maxWidth: '100%', px: 1.5, py: 1.25, pointerEvents: faded || collapsed ? 'none' : 'auto', ...dim }}>
          {route.waypoints.length === 0 ? (
            <Box sx={{ fontSize: 12, color: MUTED, textAlign: 'center', py: '4px' }}>
              Add a waypoint to begin building the route.
            </Box>
          ) : (
            <RouteFlow route={route} calc={calc} />
          )}
        </Box>
        </Box>
      </Box>

      <HudHandle
        collapsed={collapsed}
        calculating={calculating}
        faded={faded}
        onToggle={() => setCollapsed((c) => !c)}
      />
    </Box>
  );
};

export default RouteHud;
