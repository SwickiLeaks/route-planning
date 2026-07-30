import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import RouteIcon from '@mui/icons-material/Route';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { colors, surface } from '@/theme/tokens';
import { MONO, MUTED, FAINT, glassPane } from '@/components/shared/hudStyle';
import { AIRPORTS, lookupAirport, type Airport } from '@/route/airports';
import { useRouteBuilder } from '@/route/RouteBuilderContext';
import RouteChip from '@/components/builder/RouteChip';

const MAX_SUGGESTIONS = 7;

// Ranks airports whose code/name matches the query, code-prefix hits first.
const matchAirports = (query: string): Airport[] => {
  const q = query.trim().toUpperCase();
  if (!q) return [];
  return AIRPORTS.filter(
    (a) => a.code.toUpperCase().includes(q) || a.name.toUpperCase().includes(q),
  )
    .sort((a, b) => Number(b.code.startsWith(q)) - Number(a.code.startsWith(q)))
    .slice(0, MAX_SUGGESTIONS);
};

// Route entry bar: type airport codes with autocomplete; space drops a chip.
const RouteBar = () => {
  const { route, addWaypoint, removeWaypoint, moveWaypoint, selectWaypoint, selectedWaypointId } =
    useRouteBuilder();
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const prevCount = useRef(route.waypoints.length);

  const suggestions = !/[\s,]/.test(text) ? matchAirports(text) : [];
  const open = focused && !dismissed && suggestions.length > 0;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Keep the caret in the entry field after a chip lands, so codes chain smoothly.
  useEffect(() => {
    if (route.waypoints.length > prevCount.current) inputRef.current?.focus();
    prevCount.current = route.waypoints.length;
  }, [route.waypoints.length]);

  // Reset the active suggestion whenever the query changes.
  useEffect(() => setHighlight(0), [text]);

  const addAirport = (airport: Airport) => {
    addWaypoint(airport.position, airport.code);
    setText('');
  };

  // Adds a waypoint if the token is a known airport code; returns whether it matched.
  const resolve = (token: string): boolean => {
    const airport = lookupAirport(token);
    if (!airport) return false;
    addWaypoint(airport.position, airport.code);
    return true;
  };

  // On each keystroke, space-delimited codes resolve into chips; the rest stays typed.
  const handleChange = (value: string) => {
    setDismissed(false);
    if (!/[\s,]/.test(value)) {
      setText(value);
      return;
    }
    const trailing = /[\s,]$/.test(value);
    const parts = value.split(/[\s,]+/).filter(Boolean);
    const pending = trailing ? '' : parts.pop() ?? '';
    const leftover = parts.filter((token) => !resolve(token));
    setText([...leftover, pending].filter(Boolean).join(' '));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (open && event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlight((h) => (h + 1) % suggestions.length);
    } else if (open && event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlight((h) => (h - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === 'Escape') {
      setDismissed(true);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (open) addAirport(suggestions[highlight]);
      else if (text.trim() && resolve(text.trim())) setText('');
    } else if (event.key === 'Backspace' && text === '' && route.waypoints.length > 0) {
      removeWaypoint(route.waypoints[route.waypoints.length - 1].id);
    }
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = route.waypoints.findIndex((w) => w.id === active.id);
    const to = route.waypoints.findIndex((w) => w.id === over.id);
    if (from >= 0 && to >= 0) moveWaypoint(from, to);
  };

  return (
    <>
      <Box
        ref={anchorRef}
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '6px',
          px: 1.25,
          py: 0.5,
          borderRadius: '10px',
          bgcolor: 'rgba(255,255,255,0.03)',
          border: `1px solid ${surface.border}`,
          transition: 'border-color 120ms ease',
          '&:focus-within': { borderColor: colors.accent },
        }}
      >
        <RouteIcon sx={{ fontSize: 18, color: colors.accent, mr: '2px', flexShrink: 0 }} />

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={route.waypoints.map((w) => w.id)} strategy={rectSortingStrategy}>
            {route.waypoints.map((wp, i) => (
              <RouteChip
                key={wp.id}
                waypoint={wp}
                index={i}
                selected={wp.id === selectedWaypointId}
                onSelect={() => selectWaypoint(wp.id === selectedWaypointId ? null : wp.id)}
                onRemove={() => removeWaypoint(wp.id)}
              />
            ))}
          </SortableContext>
        </DndContext>

        <InputBase
          inputRef={inputRef}
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={route.waypoints.length ? 'Add code…' : 'Type airport codes, e.g. KBNA KJWN M91'}
          sx={{
            flex: 1,
            minWidth: 160,
            '& input': {
              p: 0,
              fontFamily: MONO,
              fontSize: 13.5,
              color: colors.white,
              textTransform: 'uppercase',
              '&::placeholder': { color: FAINT, textTransform: 'none', opacity: 1 },
            },
          }}
        />
      </Box>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        style={{ zIndex: 1300, width: anchorRef.current?.offsetWidth }}
      >
        <Paper sx={{ ...glassPane, mt: 0.5, py: 0.5, overflow: 'hidden' }}>
          <MenuList dense disablePadding>
            {suggestions.map((a, i) => (
              <MenuItem
                key={a.code}
                selected={i === highlight}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setHighlight(i)}
                onClick={() => addAirport(a)}
                sx={{
                  gap: 1.25,
                  '&.Mui-selected': { bgcolor: `${colors.accent}1f` },
                  '&.Mui-selected:hover': { bgcolor: `${colors.accent}2b` },
                }}
              >
                <Box sx={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: colors.accent, minWidth: 46 }}>
                  {a.code}
                </Box>
                <Box sx={{ fontSize: 13, color: MUTED }}>{a.name}</Box>
              </MenuItem>
            ))}
          </MenuList>
        </Paper>
      </Popper>
    </>
  );
};

export default RouteBar;
