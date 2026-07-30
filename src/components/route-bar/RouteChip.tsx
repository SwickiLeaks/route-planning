import { Chip } from "@mui/material";
import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import type { Waypoint } from "@/types/proto";

export interface RouteChipProps {
  point: Waypoint;
  index: number;
  onDelete: () => void;
}

export function RouteChip(props: RouteChipProps): React.JSX.Element {
  return (
    <Chip
      label={props.point.id}
      sx={{ marginRight: "5px" }}
      onDelete={props.onDelete}
      deleteIcon={
        <CancelIcon
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            props.onDelete();
          }}
        />
      }
    />
  );
}
