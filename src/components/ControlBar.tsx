import SampleControls from "@/components/SampleControls";
import { surface } from "@/theme/tokens";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useRef, useState } from "react";
import { RouteBar } from "./route-bar/RouteBar";
import { PlatormSelect } from "./PlatformSelect";
import RouteIcon from "@mui/icons-material/Route";
import LayersIcon from "@mui/icons-material/Layers";
import CalculateIcon from "@mui/icons-material/Calculate";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Grid } from "@mui/material";

const DEFAULT_HEIGHT = 240;
const MIN_HEIGHT = 64;
// Dragging the section smaller than this snaps it fully closed.
const COLLAPSE_BELOW = 72;
// Cap so the panel can't swallow the whole map.
const MAX_HEIGHT_VH = 0.6;

// ControlBar component
const ControlBar = () => {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const drag = useRef<{ startY: number; startHeight: number } | null>(null);

  const onGripPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    drag.current = { startY: event.clientY, startHeight: height };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onGripPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;

    const max = Math.round(window.innerHeight * MAX_HEIGHT_VH);
    const next =
      drag.current.startHeight + (event.clientY - drag.current.startY);
    setHeight(Math.min(max, Math.max(MIN_HEIGHT, next)));
  };

  const onGripPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;

    const finalHeight =
      drag.current.startHeight + (event.clientY - drag.current.startY);
    drag.current = null;

    if (finalHeight < COLLAPSE_BELOW) {
      setOpen(false);
      setHeight(DEFAULT_HEIGHT);
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 12,
        left: "50%",
        transform: "translateX(-50%)",
        width: "75%",
        zIndex: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          bgcolor: surface.overlay,
          backdropFilter: "blur(12px)",
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Grid
          container
          size={12}
          sx={{ alignItems: "center", padding: "10px" }}
        >
          <Grid size={8} sx={{ paddingRight: "5px" }}>
            <RouteBar />
          </Grid>
          <Grid size={2} sx={{ paddingRight: "5px" }}>
            <PlatormSelect />
          </Grid>
          <Grid
            size={2}
            sx={{ justifyContent: "space-evenly", display: "flex" }}
          >
            <IconButton
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-label="Routes"
            >
              <RouteIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() => setOpen((value) => !value)}
              aria-label="Layers"
              aria-expanded={open}
            >
              <LayersIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() => setOpen((value) => !value)}
              aria-label="Calculate"
              aria-expanded={open}
            >
              <CalculateIcon fontSize="small" />
            </IconButton>
            <IconButton
              color="success"
              onClick={() => setOpen((value) => !value)}
              aria-label="Calculation Status"
              aria-expanded={open}
            >
              <CheckCircleIcon fontSize="small" />
            </IconButton>
          </Grid>
        </Grid>

        <Collapse in={open}>
          <Box
            sx={{
              height,
              overflow: "auto",
              borderTop: "1px solid",
              borderColor: "divider",
              p: 1.5,
            }}
          >
            <SampleControls />
          </Box>
        </Collapse>
      </Paper>
      {open && (
        <Box
          onPointerDown={onGripPointerDown}
          onPointerMove={onGripPointerMove}
          onPointerUp={onGripPointerUp}
          role="separator"
          aria-orientation="horizontal"
          aria-label="Resize control section"
          sx={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translate(-50%, -1px)",
            width: 56,
            height: 16,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: surface.overlay,
            backdropFilter: "blur(12px)",
            border: "1px solid",
            borderColor: "divider",
            borderTop: "none",
            borderRadius: "0 0 8px 8px",
            cursor: "ns-resize",
            touchAction: "none",
            userSelect: "none",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <DragHandleIcon sx={{ fontSize: 14, opacity: 0.6 }} />
        </Box>
      )}
    </Box>
  );
};

export default ControlBar;
