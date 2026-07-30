import type { Waypoint } from "@/types/proto";
import { Box } from "@mui/material";
import React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { RouteChipDroppable } from "./RouteChipDroppable";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

export interface RouteChipsContainerProps {
  waypoints: Waypoint[];
  onRemove: (waypoint: Waypoint, index: number) => void;
  onSwap: (indexOne: number, indexTwo: number) => void;
}

export function RouteChipsContainer(
  props: RouteChipsContainerProps,
): React.JSX.Element {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const prevIndex: number = props.waypoints.findIndex(
        (waypoint: Waypoint) => waypoint.id === active.id,
      );
      const newIndex: number = props.waypoints.findIndex(
        (waypoint: Waypoint) => waypoint.id === over?.id,
      );
      if (prevIndex > -1 && newIndex > -1) {
        props.onSwap(prevIndex, newIndex);
      }
    }
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      sensors={sensors}
      collisionDetection={closestCenter}
    >
      <SortableContext items={props.waypoints}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            rowGap: "10px",
          }}
        >
          {props.waypoints.map((point, index) => (
            <RouteChipDroppable
              point={point}
              index={index}
              onRemoveWaypoint={props.onRemove}
            />
          ))}
        </Box>
      </SortableContext>
    </DndContext>
  );
}
