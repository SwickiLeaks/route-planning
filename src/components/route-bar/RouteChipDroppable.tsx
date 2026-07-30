import React from "react";
import type { Waypoint } from "@/types/proto";
import { Box } from "@mui/material";
import { RouteChip } from "./RouteChip";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface RouteChipDroppableProps {
  index: number;
  point: Waypoint;
  onRemoveWaypoint: (point: Waypoint, index: number) => void;
}

export function RouteChipDroppable(
  props: RouteChipDroppableProps,
): React.JSX.Element {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.point.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box
      ref={setNodeRef}
      sx={{ ...style, cursor: isDragging ? "grabbing" : "grab" }}
      {...attributes}
      {...listeners}
    >
      <RouteChip
        key={`${props.point?.id}-chip-${props.index}`}
        point={props.point}
        onDelete={() => {
          props.onRemoveWaypoint(props.point, props.index);
        }}
        index={props.index}
      />
    </Box>
  );
}
