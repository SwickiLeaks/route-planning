import { useEffect, useState } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { colors } from '@/theme/tokens';
import { MONO, MUTED, glassPane } from '@/components/shared/hudStyle';
import { actionDef } from '@/route/actionCatalog';
import { useRouteBuilder } from '@/route/RouteBuilderContext';
import type { BuilderWaypoint } from '@/route/routeBuilderTypes';

const HOVER_DEFAULT = { durationSec: 120, altitudeFt: 50 };

const toInt = (raw: string): number | null => {
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
};

// Compact number field styled for the dark glass popover.
const fieldSx = {
  width: '6.5rem',
  '& .MuiInputBase-input': { fontFamily: MONO, fontSize: 13, py: '6px' },
};

// On-map popover to add, edit, or remove a waypoint's Hover action.
const WaypointActionMenu = ({
  waypoint,
  onClose,
}: {
  waypoint: BuilderWaypoint;
  onClose: () => void;
}) => {
  const { addAction, updateAction, removeAction } = useRouteBuilder();
  const def = actionDef('hover');
  const hover = (waypoint.actions ?? []).find((a) => a.type === 'hover');

  const [duration, setDuration] = useState(String(hover?.params?.durationSec ?? HOVER_DEFAULT.durationSec));
  const [altitude, setAltitude] = useState(String(hover?.params?.altitudeFt ?? HOVER_DEFAULT.altitudeFt));

  const durN = toInt(duration);
  const altN = toInt(altitude);

  // Close on Escape while the popover is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const commitDuration = (v: string) => {
    setDuration(v);
    const n = toInt(v);
    if (hover && n != null) updateAction(waypoint.id, hover.id, { durationSec: n });
  };
  const commitAltitude = (v: string) => {
    setAltitude(v);
    const n = toInt(v);
    if (hover && n != null) updateAction(waypoint.id, hover.id, { altitudeFt: n });
  };

  const addHover = () =>
    addAction(waypoint.id, 'hover', {
      durationSec: durN ?? HOVER_DEFAULT.durationSec,
      altitudeFt: altN ?? HOVER_DEFAULT.altitudeFt,
    });

  const stop = (e: { stopPropagation: () => void }) => e.stopPropagation();

  return (
    <Marker longitude={waypoint.position.lng} latitude={waypoint.position.lat} anchor="top-left" offset={[14, 16]}>
      <Box
        onClick={stop}
        onPointerDown={stop}
        sx={{ ...glassPane, width: 244, p: 1.25, cursor: 'default' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px', mb: 1 }}>
          <def.Icon sx={{ fontSize: 16, color: def.color }} />
          <Box sx={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: colors.white, flex: 1 }}>
            HOVER
          </Box>
          <IconButton size="small" onClick={onClose} sx={{ color: MUTED, p: '2px' }}>
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 1.25 }}>
          <TextField
            label="Time (s)"
            size="small"
            value={duration}
            error={durN == null}
            onChange={(e) => commitDuration(e.target.value)}
            sx={fieldSx}
          />
          <TextField
            label="Alt (ft)"
            size="small"
            value={altitude}
            error={altN == null}
            onChange={(e) => commitAltitude(e.target.value)}
            sx={fieldSx}
          />
        </Box>

        {hover ? (
          <Button
            fullWidth
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteOutlineIcon />}
            onClick={() => removeAction(waypoint.id, hover.id)}
          >
            Remove Hover
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="small"
            startIcon={<def.Icon sx={{ fontSize: 15 }} />}
            onClick={addHover}
          >
            Add Hover
          </Button>
        )}
      </Box>
    </Marker>
  );
};

export default WaypointActionMenu;
