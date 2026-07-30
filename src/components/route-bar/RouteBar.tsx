import { Box, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouteStore } from "../../stores/route-store";
import type { Route, Waypoint } from "@/types/proto";
import { RouteChipsContainer } from "./RouteChipsContainer";
import { surface } from "@/theme";
import { arrayMove } from "@dnd-kit/sortable";

export function RouteBar(): React.JSX.Element {
  const routeStore = useRouteStore();
  const allPoints: Waypoint[] = routeStore.availableWaypoints;
  const [selectedWaypoints, setSelectedWaypoints] = useState<Waypoint[]>([]);
  const [inputText, setInputText] = useState<string>("");

  useEffect(() => {
    let currentRoute: Route | undefined = { ...routeStore.currentRoute };
    if (!currentRoute) {
      currentRoute = { id: "", name: "", waypoints: [...selectedWaypoints] };
    } else {
      currentRoute.waypoints = [...selectedWaypoints];
    }
    routeStore.setCurrentRoute(currentRoute);
  }, [selectedWaypoints]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ) => {
    const newText: string = event.target.value;
    if (inputText === "" && newText === "") {
      setSelectedWaypoints(
        selectedWaypoints.slice(0, selectedWaypoints.length - 1),
      );
    } else {
      const newPoints: Waypoint[] = [];
      let leftOverText: string = "";
      //need to rework here to maybe use a map or more efficient data structure
      const possiblePointIds = newText.split(" ");
      for (const possiblePointId of possiblePointIds) {
        const foundWaypoint: Waypoint | undefined = allPoints.find(
          (point: Waypoint) =>
            point.id.toLowerCase() === possiblePointId.toLowerCase(),
        );
        if (foundWaypoint) {
          newPoints.push(foundWaypoint);
        } else {
          leftOverText += possiblePointId;
        }
      }
      setSelectedWaypoints([...selectedWaypoints, ...newPoints]);
      setInputText(leftOverText);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      event.key === "Backspace" &&
      inputText === "" &&
      selectedWaypoints.length > 0
    ) {
      setSelectedWaypoints(
        selectedWaypoints.slice(0, selectedWaypoints.length - 1),
      );
    }
  };

  const deletePoint = (index: number) => {
    if (selectedWaypoints.length > index) {
      const newPoints: Waypoint[] = [...selectedWaypoints];
      newPoints.splice(index, 1);
      setSelectedWaypoints(newPoints);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        display: "flex",
        flexWrap: "wrap",
        padding: "10px",
        alignItems: "center",
        textAlign: "center",
        border: "1px solid",
        borderColor: `${surface.border}`,
        borderRadius: 1,
        "&:hover": {
          borderColor: "text.primary",
        },
        "&:focus": {
          borderColor: "text.primary",
          outline: "none",
        },
      }}
    >
      <RouteChipsContainer
        waypoints={selectedWaypoints}
        onRemove={(_: Waypoint, index: number) => {
          deletePoint(index);
        }}
        onSwap={(indexOne: number, indexTwo: number) => {
          setSelectedWaypoints(
            arrayMove(selectedWaypoints, indexOne, indexTwo),
          );
        }}
      />
      <TextField
        value={inputText}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        placeholder={selectedWaypoints.length > 0 ? undefined : "Route..."}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "& .MuiInputBase-input": { padding: "0px" },
        }}
      />
    </Box>
  );
}
