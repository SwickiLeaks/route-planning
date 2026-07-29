import WaypointEditor from "@/components/builder/WaypointEditor";
import WaypointTile from "@/components/builder/WaypointTile";
import { FAINT, MONO, MUTED } from "@/components/shared/hudStyle";
import { INITIAL_VIEW } from "@/map/region";
import { AIRPORTS, lookupAirport, type Airport } from "@/route/airports";
import { useRouteBuilder } from "@/route/RouteBuilderContext";
import { colors } from "@/theme/tokens";
import type { LatLng } from "@/types/proto";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";

// Places a new waypoint just past the last so typed points form a visible chain.
const nextPosition = (last?: LatLng): LatLng =>
  last
    ? { lat: last.lat + 0.015, lng: last.lng + 0.04 }
    : { lat: INITIAL_VIEW.latitude, lng: INITIAL_VIEW.longitude };

// A code/name token becomes an uppercase airport code or a titled name.
const toName = (token: string): string =>
  /[a-z]/i.test(token) ? token.toUpperCase() : token;

// Route builder: add waypoints by code/name, then drag tiles to reorder.
const RouteComposer = () => {
  const { route, addWaypoint, moveWaypoint } = useRouteBuilder();
  const [text, setText] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Adds one resolved airport at its real coordinates.
  const addAirport = (airport: Airport) => {
    addWaypoint(airport.position, airport.code);
    setText("");
  };

  // Adds free text: known codes resolve to real coordinates, the rest chain
  // from the previous point so they still land on the map.
  const commit = (raw: string) => {
    const tokens = raw
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter(Boolean);
    if (!tokens.length) return;
    let last: LatLng | undefined =
      route.waypoints[route.waypoints.length - 1]?.position;
    for (const token of tokens) {
      const airport = lookupAirport(token);
      const pos: LatLng = airport ? airport.position : nextPosition(last);
      addWaypoint(pos, airport ? airport.code : toName(token));
      last = pos;
    }
    setText("");
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = route.waypoints.findIndex((w) => w.id === active.id);
    const to = route.waypoints.findIndex((w) => w.id === over.id);
    if (from >= 0 && to >= 0) moveWaypoint(from, to);
  };

  return (
    <Stack spacing={1.25} sx={{ py: 0.5 }}>
      <Box>
        <Autocomplete
          freeSolo
          autoHighlight
          selectOnFocus
          handleHomeEndKeys
          options={AIRPORTS}
          value={null}
          inputValue={text}
          onInputChange={(_, value, reason) => {
            if (reason !== "reset") setText(value);
          }}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.code
          }
          filterOptions={(options, state) => {
            const q = state.inputValue.trim().toUpperCase();
            if (!q || /[\s,]/.test(state.inputValue)) return [];
            return options.filter(
              (o) =>
                o.code.toUpperCase().includes(q) ||
                o.name.toUpperCase().includes(q),
            );
          }}
          onChange={(_, value) => {
            if (!value) return;
            if (typeof value === "string") commit(value);
            else addAirport(value);
          }}
          renderOption={(props, option) => {
            const { key, ...rest } = props as { key: string };
            return (
              <Box
                component="li"
                key={key}
                {...rest}
                sx={{ display: "flex", gap: 1.25, alignItems: "baseline" }}
              >
                <Box
                  sx={{
                    fontFamily: MONO,
                    fontSize: 13,
                    fontWeight: 700,
                    color: colors.accent,
                    minWidth: 46,
                  }}
                >
                  {option.code}
                </Box>
                <Box sx={{ fontSize: 13, color: colors.white }}>
                  {option.name}
                </Box>
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              placeholder="Add waypoints — codes or names, e.g. KBNA, Summit, KJFK"
              slotProps={{
                ...params.slotProps,
                input: {
                  ...params.slotProps.input,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <AddLocationAltIcon sx={{ color: colors.accent }} />
                      </InputAdornment>
                      {params.slotProps.input.startAdornment}
                    </>
                  ),
                },
              }}
            />
          )}
        />
        <Typography
          variant="caption"
          sx={{ color: FAINT, mt: 0.5, display: "block" }}
        >
          Add airport codes with spaces here
        </Typography>
      </Box>

      {route.waypoints.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 3,
            borderRadius: "11px",
            border: "1px dashed rgba(255,255,255,0.14)",
            color: MUTED,
            fontSize: 13,
          }}
        >
          No waypoints yet — add one above to start the route.
        </Box>
      ) : (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={route.waypoints.map((w) => w.id)}
              strategy={rectSortingStrategy}
            >
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {route.waypoints.map((wp, i) => (
                  <WaypointTile
                    key={wp.id}
                    waypoint={wp}
                    index={i}
                    isEndpoint={i === 0 || i === route.waypoints.length - 1}
                  />
                ))}
              </Box>
            </SortableContext>
          </DndContext>

          <WaypointEditor />
        </>
      )}
    </Stack>
  );
};

export default RouteComposer;
