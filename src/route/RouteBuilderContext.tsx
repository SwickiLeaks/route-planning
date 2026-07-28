import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type { LatLng } from '@/types/proto';
import type {
  ActionParams,
  BuilderRoute,
  BuilderWaypoint,
  WaypointActionType,
} from '@/route/routeBuilderTypes';

/** Sensible starting parameters for a newly added action. */
const defaultParams = (type: WaypointActionType, wp: BuilderWaypoint): ActionParams =>
  type === 'hover' ? { durationSec: 60, altitudeFt: wp.altitudeFt } : {};

/* ── IDs ──────────────────────────────────────────────────────────────── */
let seq = 0;
const uid = (prefix: string) => `${prefix}-${(seq += 1)}`;

/* ── State + actions ──────────────────────────────────────────────────── */

interface State {
  route: BuilderRoute;
  selectedWaypointId: string | null;
}

type Action =
  | { type: 'addWaypoint'; position: LatLng; name?: string; altitudeFt?: number }
  | { type: 'removeWaypoint'; id: string }
  | { type: 'moveWaypoint'; from: number; to: number }
  | { type: 'updateWaypoint'; id: string; patch: Partial<BuilderWaypoint> }
  | { type: 'selectWaypoint'; id: string | null }
  | { type: 'addAction'; waypointId: string; actionType: WaypointActionType }
  | { type: 'updateAction'; waypointId: string; actionId: string; params: ActionParams }
  | { type: 'removeAction'; waypointId: string; actionId: string };

const arrayMove = <T,>(list: T[], from: number, to: number): T[] => {
  const next = list.slice();
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
};

const mapWaypoint = (
  route: BuilderRoute,
  id: string,
  fn: (wp: BuilderWaypoint) => BuilderWaypoint,
): BuilderRoute => ({
  ...route,
  waypoints: route.waypoints.map((wp) => (wp.id === id ? fn(wp) : wp)),
});

const reducer = (state: State, action: Action): State => {
  const { route } = state;

  switch (action.type) {
    case 'addWaypoint': {
      const wp: BuilderWaypoint = {
        id: uid('wp'),
        name:
          action.name?.trim() ||
          `${action.position.lat.toFixed(3)}, ${action.position.lng.toFixed(3)}`,
        position: action.position,
        altitudeFt: action.altitudeFt,
        actions: [],
      };
      return {
        ...state,
        route: { ...route, waypoints: [...route.waypoints, wp] },
        selectedWaypointId: wp.id,
      };
    }

    case 'removeWaypoint':
      return {
        ...state,
        route: {
          ...route,
          waypoints: route.waypoints.filter((wp) => wp.id !== action.id),
        },
        selectedWaypointId:
          state.selectedWaypointId === action.id ? null : state.selectedWaypointId,
      };

    case 'moveWaypoint':
      return {
        ...state,
        route: {
          ...route,
          waypoints: arrayMove(route.waypoints, action.from, action.to),
        },
      };

    case 'updateWaypoint':
      return {
        ...state,
        route: mapWaypoint(route, action.id, (wp) => ({ ...wp, ...action.patch })),
      };

    case 'selectWaypoint':
      return { ...state, selectedWaypointId: action.id };

    case 'addAction':
      return {
        ...state,
        route: mapWaypoint(route, action.waypointId, (wp) => ({
          ...wp,
          actions: [
            ...(wp.actions ?? []),
            { id: uid('act'), type: action.actionType, params: defaultParams(action.actionType, wp) },
          ],
        })),
      };

    case 'updateAction':
      return {
        ...state,
        route: mapWaypoint(route, action.waypointId, (wp) => ({
          ...wp,
          actions: (wp.actions ?? []).map((a) =>
            a.id === action.actionId ? { ...a, params: { ...a.params, ...action.params } } : a,
          ),
        })),
      };

    case 'removeAction':
      return {
        ...state,
        route: mapWaypoint(route, action.waypointId, (wp) => ({
          ...wp,
          actions: (wp.actions ?? []).filter((a) => a.id !== action.actionId),
        })),
      };

    default:
      return state;
  }
};

/* ── Context ──────────────────────────────────────────────────────────── */

interface RouteBuilderValue extends State {
  addWaypoint: (position: LatLng, name?: string, altitudeFt?: number) => void;
  removeWaypoint: (id: string) => void;
  moveWaypoint: (from: number, to: number) => void;
  updateWaypoint: (id: string, patch: Partial<BuilderWaypoint>) => void;
  selectWaypoint: (id: string | null) => void;
  addAction: (waypointId: string, actionType: WaypointActionType) => void;
  updateAction: (waypointId: string, actionId: string, params: ActionParams) => void;
  removeAction: (waypointId: string, actionId: string) => void;
}

const RouteBuilderContext = createContext<RouteBuilderValue | null>(null);

export const RouteBuilderProvider = ({
  initialRoute,
  children,
}: {
  initialRoute: BuilderRoute;
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, {
    route: initialRoute,
    selectedWaypointId: null,
  });

  const value = useMemo<RouteBuilderValue>(
    () => ({
      ...state,
      addWaypoint: (position, name, altitudeFt) =>
        dispatch({ type: 'addWaypoint', position, name, altitudeFt }),
      removeWaypoint: (id) => dispatch({ type: 'removeWaypoint', id }),
      moveWaypoint: (from, to) => dispatch({ type: 'moveWaypoint', from, to }),
      updateWaypoint: (id, patch) => dispatch({ type: 'updateWaypoint', id, patch }),
      selectWaypoint: (id) => dispatch({ type: 'selectWaypoint', id }),
      addAction: (waypointId, actionType) =>
        dispatch({ type: 'addAction', waypointId, actionType }),
      updateAction: (waypointId, actionId, params) =>
        dispatch({ type: 'updateAction', waypointId, actionId, params }),
      removeAction: (waypointId, actionId) =>
        dispatch({ type: 'removeAction', waypointId, actionId }),
    }),
    [state],
  );

  return (
    <RouteBuilderContext.Provider value={value}>
      {children}
    </RouteBuilderContext.Provider>
  );
};

export const useRouteBuilder = (): RouteBuilderValue => {
  const ctx = useContext(RouteBuilderContext);
  if (!ctx) throw new Error('useRouteBuilder must be used within RouteBuilderProvider');
  return ctx;
};
