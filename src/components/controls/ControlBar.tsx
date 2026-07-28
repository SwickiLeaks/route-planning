import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import Box from '@mui/material/Box';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { glassPane } from '@/components/shared/hudStyle';
import { TOP_PANES } from '@/components/controls/topPaneRegistry';
import type { TopPane } from '@/components/controls/topPaneRegistry';
import ControlTile from '@/components/controls/ControlTile';

const MIN_HEIGHT = 64;
const COLLAPSE_BELOW = 72;
const MAX_HEIGHT_VH = 0.85;
const PANE_TOP = 66;

// Top control dock: a row of glass tiles that open panes in their declared dock.
const ControlBar = ({ faded = false }: { faded?: boolean }) => {
  const [active, setActive] = useState<{ top: string | null; left: string | null }>({
    top: null,
    left: null,
  });
  const [manualHeight, setManualHeight] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startY: number; startHeight: number } | null>(null);

  const topPane = TOP_PANES.find((p) => p.dock === 'top' && p.id === active.top) ?? null;
  const leftPane = TOP_PANES.find((p) => p.dock === 'left' && p.id === active.left) ?? null;

  const toggle = (pane: TopPane) => {
    setActive((a) => ({ ...a, [pane.dock]: a[pane.dock] === pane.id ? null : pane.id }));
    if (pane.dock === 'top') setManualHeight(null);
  };

  const onGripPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const current = contentRef.current?.offsetHeight ?? MIN_HEIGHT;
    drag.current = { startY: event.clientY, startHeight: current };
    setManualHeight(current);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onGripPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const max = Math.round(window.innerHeight * MAX_HEIGHT_VH);
    const next = drag.current.startHeight + (event.clientY - drag.current.startY);
    setManualHeight(Math.min(max, Math.max(MIN_HEIGHT, next)));
  };

  const onGripPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const finalHeight = drag.current.startHeight + (event.clientY - drag.current.startY);
    drag.current = null;
    if (finalHeight < COLLAPSE_BELOW) {
      setActive((a) => ({ ...a, top: null }));
      setManualHeight(null);
    }
  };

  const fade = {
    opacity: faded ? 0.12 : 1,
    pointerEvents: (faded ? 'none' : 'auto') as 'none' | 'auto',
    transition: `opacity ${faded ? 150 : 450}ms ease, transform ${faded ? 150 : 450}ms ease`,
  };

  return (
    <Box sx={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          left: '50%',
          display: 'flex',
          gap: 1,
          ...fade,
          transform: `translateX(-50%) translateY(${faded ? -12 : 0}px)`,
        }}
      >
        {TOP_PANES.map((pane) => (
          <ControlTile
            key={pane.id}
            icon={pane.icon}
            label={pane.label}
            active={active[pane.dock] === pane.id}
            onClick={() => toggle(pane)}
          />
        ))}
      </Box>

      {topPane && (
        <Box
          sx={{
            position: 'absolute',
            top: PANE_TOP,
            left: '50%',
            width: 'min(1320px, calc(100vw - 24px))',
            ...fade,
            transform: `translateX(-50%) translateY(${faded ? -12 : 0}px)`,
          }}
        >
          <Box sx={{ ...glassPane, overflow: 'hidden' }}>
            <Box
              ref={contentRef}
              sx={{
                height: manualHeight ?? 'auto',
                overflowY: manualHeight != null ? 'auto' : 'visible',
                p: 1.5,
              }}
            >
              {topPane.content}
            </Box>
          </Box>

          <Box
            onPointerDown={onGripPointerDown}
            onPointerMove={onGripPointerMove}
            onPointerUp={onGripPointerUp}
            role="separator"
            aria-orientation="horizontal"
            aria-label="Resize pane"
            sx={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translate(-50%, -1px)',
              width: 56,
              height: 16,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: glassPane.bgcolor,
              backdropFilter: glassPane.backdropFilter,
              border: glassPane.border,
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
        </Box>
      )}

      {leftPane && (
        <Box
          sx={{
            position: 'absolute',
            top: PANE_TOP,
            left: 12,
            width: 'min(300px, calc(100vw - 24px))',
            maxHeight: 'calc(100vh - 90px)',
            overflowY: 'auto',
            ...glassPane,
            ...fade,
            transform: `translateX(${faded ? -12 : 0}px)`,
            p: 1.5,
          }}
        >
          {leftPane.content}
        </Box>
      )}
    </Box>
  );
};

export default ControlBar;
