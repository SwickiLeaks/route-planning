import { useEffect, useRef } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import Box from '@mui/material/Box';
import { colors } from '@/theme/tokens';
import { MONO, PANEL_BORDER, glow } from '@/components/shared/hudStyle';
import { actionDef } from '@/route/actionCatalog';
import WaypointInfoCard from '@/components/map/WaypointInfoCard';
import { usePanels } from '@/components/controls/PanelContext';
import type { LegCalc } from '@/calc/types';
import type { BuilderWaypoint } from '@/route/routeBuilderTypes';

interface WaypointMarkerProps {
  waypoint: BuilderWaypoint;
  index: number;
  isEndpoint: boolean;
  leg?: LegCalc;
  selected: boolean;
  onSelect: () => void;
}

// Waypoint marker: a shape on the point plus a chip that expands to full info.
const WaypointMarker = ({
  waypoint,
  index,
  isEndpoint,
  leg,
  selected,
  onSelect,
}: WaypointMarkerProps) => {
  const { activePanel, closePanel } = usePanels();
  // The tooltip expands when this waypoint is selected, but never while a top-bar
  // side panel is open — the two float over the same space and would collide. A
  // tabular row selection thus highlights the marker without popping the tooltip.
  const expanded = selected && !activePanel;
  const chipRef = useRef<HTMLDivElement>(null);
  const baseColor = (waypoint.actions?.length ?? 0) > 0 ? colors.accent : isEndpoint ? colors.gold : colors.brown;
  const accent = selected ? colors.accent : baseColor;
  const isStart = index === 0;
  const size = selected ? 18 : 15;
  const fill = selected ? `${colors.accent}33` : 'rgba(16,17,19,0.85)';
  const actions = waypoint.actions ?? [];
  const lng = waypoint.position.lng;
  const lat = waypoint.position.lat;

  // MapLibre markers preventDefault on mousedown (blocking input focus) and the
  // map pans on drag; stop those on the chip so its controls work.
  useEffect(() => {
    const el = chipRef.current;
    if (!el) return;
    const stop = (e: Event) => e.stopPropagation();
    el.addEventListener('mousedown', stop);
    el.addEventListener('touchstart', stop);
    return () => {
      el.removeEventListener('mousedown', stop);
      el.removeEventListener('touchstart', stop);
    };
  }, []);

  // Interacting with a marker on the map expands its tooltip, so close any open
  // side panel first — the panel and an expanded tooltip are mutually exclusive.
  const select = (e: { originalEvent: { stopPropagation: () => void } }) => {
    e.originalEvent.stopPropagation();
    closePanel();
    onSelect();
  };

  const toggle = () => {
    closePanel();
    onSelect();
  };

  return (
    <>
      <Marker longitude={lng} latitude={lat} anchor="center" onClick={select}>
        <Box sx={{ position: 'relative', cursor: 'pointer', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {selected && (
            <Box sx={{ position: 'absolute', inset: 0, m: 'auto', width: size + 12, height: size + 12, borderRadius: '50%', border: `1px solid ${colors.accent}66` }} />
          )}
          {isStart ? (
            <Box
              component="svg"
              viewBox="0 0 20 20"
              sx={{ width: size + 3, height: size + 3, display: 'block', filter: `drop-shadow(${glow(accent)})` }}
            >
              <polygon points="10,1.5 18.5,17.5 1.5,17.5" fill={fill} stroke={accent} strokeWidth={2.4} strokeLinejoin="round" />
            </Box>
          ) : (
            <>
              <Box sx={{ width: size, height: size, borderRadius: '50%', border: `2.5px solid ${accent}`, bgcolor: fill, boxShadow: glow(accent) }} />
              <Box sx={{ position: 'absolute', inset: 0, m: 'auto', width: 4, height: 4, borderRadius: '50%', bgcolor: accent }} />
            </>
          )}
        </Box>
      </Marker>

      <Marker
        longitude={lng}
        latitude={lat}
        anchor="bottom-left"
        offset={[10, -9]}
        // Lift the expanded tooltip above its neighbours so options aren't covered.
        style={{ zIndex: expanded ? 5 : selected ? 3 : 1 }}
      >
        <Box
          ref={chipRef}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            px: '9px',
            py: '5px',
            borderRadius: '9px',
            boxShadow: selected ? `0 4px 18px rgba(0,0,0,0.55), 0 0 0 1px ${colors.accent}` : '0 4px 16px rgba(0,0,0,0.55)',
            bgcolor: selected ? 'rgba(28,22,13,0.95)' : 'rgba(16,17,19,0.92)',
            border: selected ? `1px solid ${colors.accent}` : PANEL_BORDER,
            backdropFilter: 'blur(6px)',
            // While a side panel is open, fade the name chip out (the small shape
            // marker stays) so chips don't bleed through the panel. Non-interactive
            // when hidden so a ghost chip can't catch clicks.
            opacity: activePanel ? 0 : 1,
            pointerEvents: activePanel ? 'none' : 'auto',
            transition: 'border-color 120ms, background-color 120ms, opacity 160ms ease',
          }}
        >
          <Box
            onClick={toggle}
            role="button"
            aria-expanded={expanded}
            sx={{ display: 'flex', alignItems: 'center', gap: '7px', whiteSpace: 'nowrap', cursor: 'pointer', '&:hover': { color: colors.accent } }}
          >
            <Box sx={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: colors.black, bgcolor: accent, borderRadius: '4px', px: '5px', py: '1px' }}>
              {String(index + 1).padStart(2, '0')}
            </Box>
            <Box sx={{ fontSize: 14, fontWeight: 500, color: colors.white }}>{waypoint.name}</Box>
            {!expanded &&
              actions.map((a) => {
                const def = actionDef(a.type);
                return <def.Icon key={a.id} sx={{ fontSize: 15, color: colors.accent }} />;
              })}
          </Box>

          {expanded && <WaypointInfoCard waypoint={waypoint} isStart={isStart} leg={leg} />}
        </Box>
      </Marker>
    </>
  );
};

export default WaypointMarker;
