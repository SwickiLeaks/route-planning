import { useEffect, useState } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import Box from '@mui/material/Box';
import { colors } from '@/theme/tokens';
import { MONO, MUTED, PANEL_BORDER, fmtLb, glow } from '@/components/shared/hudStyle';
import ActionBadge from '@/components/builder/ActionBadge';
import { actionDef } from '@/route/actionCatalog';
import WaypointActionMenu from '@/components/map/WaypointActionMenu';
import type { BuilderWaypoint } from '@/route/routeBuilderTypes';

interface WaypointMarkerProps {
  waypoint: BuilderWaypoint;
  index: number;
  remainingFuelLb: number;
  isEndpoint: boolean;
  selected: boolean;
  onSelect: () => void;
}

// Pill on the selected chip that opens the action popover; fills when Hover is set.
const HoverPill = ({ active, onOpen }: { active: boolean; onOpen: () => void }) => {
  const def = actionDef('hover');
  return (
    <Box
      role="button"
      aria-pressed={active}
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        px: '7px',
        py: '3px',
        borderRadius: '6px',
        cursor: 'pointer',
        userSelect: 'none',
        fontFamily: MONO,
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: '0.06em',
        color: active ? colors.black : def.color,
        bgcolor: active ? def.color : 'transparent',
        border: `1px ${active ? 'solid' : 'dashed'} ${def.color}${active ? '' : '88'}`,
        transition: 'background-color 140ms, color 140ms, border-color 140ms, box-shadow 140ms',
        '&:hover': {
          borderStyle: 'solid',
          bgcolor: active ? def.color : `${def.color}22`,
          boxShadow: glow(def.color),
        },
      }}
    >
      <def.Icon sx={{ fontSize: 13 }} />
      <span>{active ? 'HOVER' : '+ HOVER'}</span>
    </Box>
  );
};

// Waypoint marker: a diamond on the point plus a data chip beside it.
const WaypointMarker = ({
  waypoint,
  index,
  remainingFuelLb,
  isEndpoint,
  selected,
  onSelect,
}: WaypointMarkerProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const accent = selected ? colors.accent : isEndpoint ? colors.gold : colors.brown;
  const diamond = selected ? 18 : 14;
  const actions = waypoint.actions ?? [];
  const hoverActive = actions.some((a) => a.type === 'hover');
  const lng = waypoint.position.lng;
  const lat = waypoint.position.lat;

  // Close the action popover whenever this waypoint is deselected.
  useEffect(() => {
    if (!selected) setMenuOpen(false);
  }, [selected]);

  const select = (e: { originalEvent: { stopPropagation: () => void } }) => {
    e.originalEvent.stopPropagation();
    onSelect();
  };

  return (
    <>
      <Marker longitude={lng} latitude={lat} anchor="center" onClick={select}>
        <Box sx={{ position: 'relative', cursor: 'pointer', width: diamond, height: diamond }}>
          {selected && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                m: 'auto',
                width: diamond + 12,
                height: diamond + 12,
                transform: 'rotate(45deg)',
                border: `1px solid ${colors.accent}66`,
                borderRadius: '3px',
              }}
            />
          )}
          <Box
            sx={{
              width: diamond,
              height: diamond,
              transform: 'rotate(45deg)',
              borderRadius: '3px',
              border: `2.5px solid ${accent}`,
              bgcolor: selected ? `${colors.accent}33` : 'rgba(16,17,19,0.85)',
              boxShadow: glow(accent),
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              m: 'auto',
              width: 4,
              height: 4,
              borderRadius: '50%',
              bgcolor: accent,
            }}
          />
        </Box>
      </Marker>

      <Marker longitude={lng} latitude={lat} anchor="bottom-left" offset={[10, -9]} onClick={select}>
        <Box
          sx={{
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            whiteSpace: 'nowrap',
            px: '9px',
            py: '6px',
            borderRadius: '9px',
            boxShadow: selected
              ? `0 4px 18px rgba(0,0,0,0.55), 0 0 0 1px ${colors.accent}`
              : '0 4px 16px rgba(0,0,0,0.55)',
            bgcolor: selected ? 'rgba(28,22,13,0.92)' : 'rgba(16,17,19,0.9)',
            border: selected ? `1px solid ${colors.accent}` : PANEL_BORDER,
            transition: 'border-color 120ms, background-color 120ms',
            '&:hover': { borderColor: selected ? colors.accent : `${colors.accent}88` },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Box
              sx={{
                fontFamily: MONO,
                fontSize: 11,
                fontWeight: 600,
                color: colors.black,
                bgcolor: accent,
                borderRadius: '4px',
                px: '5px',
                py: '1px',
              }}
            >
              {String(index + 1).padStart(2, '0')}
            </Box>
            <Box sx={{ fontSize: 14, fontWeight: 500, color: colors.white }}>{waypoint.name}</Box>
          </Box>

          <Box sx={{ display: 'flex', gap: '10px', fontSize: 12, color: MUTED }}>
            <span>{(waypoint.altitudeFt ?? 0).toLocaleString()} ft</span>
            <span>{fmtLb(remainingFuelLb)} lb</span>
          </Box>

          {selected ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px', mt: '1px' }}>
              <HoverPill active={hoverActive} onOpen={() => setMenuOpen((o) => !o)} />
            </Box>
          ) : (
            actions.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px', mt: '1px' }}>
                {actions.map((a) => (
                  <ActionBadge key={a.id} type={a.type} onMap />
                ))}
              </Box>
            )
          )}
        </Box>
      </Marker>

      {selected && menuOpen && (
        <WaypointActionMenu waypoint={waypoint} onClose={() => setMenuOpen(false)} />
      )}
    </>
  );
};

export default WaypointMarker;
