import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import SampleControls from '@/components/SampleControls';
import { surface } from '@/theme/tokens';

const DEFAULT_HEIGHT = 240;
const MIN_HEIGHT = 64;
/** Dragging the section smaller than this snaps it fully closed. */
const COLLAPSE_BELOW = 72;
/** Cap so the panel can't swallow the whole map. */
const MAX_HEIGHT_VH = 0.6;

/**
 * Thin control strip floating over the top of the map. The chevron toggles an
 * expandable section for future controls; the grip on the section's bottom
 * edge drag-resizes it.
 */
const ControlBar = () => {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const drag = useRef<{ startY: number; startHeight: number } | null>(null);

  const onGripPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    drag.current = { startY: event.clientY, startHeight: height };
    // Route all pointer events to the grip until release, even when the
    // cursor crosses the map — otherwise fast drags drop the handle.
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onGripPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;

    const max = Math.round(window.innerHeight * MAX_HEIGHT_VH);
    const next = drag.current.startHeight + (event.clientY - drag.current.startY);
    setHeight(Math.min(max, Math.max(MIN_HEIGHT, next)));
  };

  const onGripPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;

    const finalHeight =
      drag.current.startHeight + (event.clientY - drag.current.startY);
    drag.current = null;

    // Dragged nearly shut → treat as intent to close, and restore a usable
    // height for the next open instead of a sliver.
    if (finalHeight < COLLAPSE_BELOW) {
      setOpen(false);
      setHeight(DEFAULT_HEIGHT);
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '75%',
        zIndex: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          bgcolor: surface.overlay,
          backdropFilter: 'blur(12px)',
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        {/* The thin bar itself. */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, minHeight: 44 }}>
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            Controls
          </Typography>
          <Box sx={{ flex: 1 }} />
          <IconButton
            size="small"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Collapse control section' : 'Expand control section'}
            aria-expanded={open}
          >
            <ExpandMoreIcon
              fontSize="small"
              sx={{
                transform: open ? 'rotate(180deg)' : 'none',
                transition: 'transform 150ms',
              }}
            />
          </IconButton>
        </Box>

        <Collapse in={open}>
          <Box
            sx={{
              height,
              overflow: 'auto',
              borderTop: '1px solid',
              borderColor: 'divider',
              p: 1.5,
            }}
          >
            <SampleControls />
          </Box>
        </Collapse>
      </Paper>

      {/* Resize grip: a small tab protruding under the panel's bottom edge.
          Lives outside the Paper because Paper clips (overflow: hidden).
          touchAction: none is required for pointer-dragging on touchscreens. */}
      {open && (
        <Box
          onPointerDown={onGripPointerDown}
          onPointerMove={onGripPointerMove}
          onPointerUp={onGripPointerUp}
          role="separator"
          aria-orientation="horizontal"
          aria-label="Resize control section"
          sx={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            // -1px overlaps the panel's bottom border so tab and panel merge.
            transform: 'translate(-50%, -1px)',
            width: 56,
            height: 16,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: surface.overlay,
            backdropFilter: 'blur(12px)',
            border: '1px solid',
            borderColor: 'divider',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            cursor: 'ns-resize',
            touchAction: 'none',
            userSelect: 'none',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <DragHandleIcon sx={{ fontSize: 14, opacity: 0.6 }} />
        </Box>
      )}
    </Box>
  );
};

export default ControlBar;
