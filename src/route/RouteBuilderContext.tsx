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

const defaultParams = (type: WaypointActionType, _wp: BuilderWaypoint): ActionParams =>
  type === 'hover' ? { durationSec: 120, altitudeFt: 50 } : {};

let seq = 0;
const uid = (prefix: string) => `${prefix}-${(seq += 1)}`;

interface State {
  route: BuilderRoute;
  selectedWaypointId: string | null;
  placing: boolean;
}

type Action =
  | { type: 'addWaypoint'; position: LatLng; name?: string; altitudeFt?: number }
  | { type: 'removeWaypoint'; id: string }
  | { type: 'moveWaypoint'; from: number; to: number }
  | { type: 'updateWaypoint'; id: string; patch: Partial<BuilderWaypoint> }
  | { type: 'selectWaypoint'; id: string | null }
  | { type: 'setPlacing'; value: boolean }
  | { type: 'addAction'; waypointId: string; actionType: WaypointActionType; params?: ActionParams }
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

    case 'setPlacing':
      return { ...state, placing: action.value };

    case 'addAction':
      return {
        ...state,
        route: mapWaypoint(route, action.waypointId, (wp) => {
          if ((wp.actions ?? []).some((a) => a.type === action.actionType)) return wp;
          return {
            ...wp,
            actions: [
              ...(wp.actions ?? []),
              {
                id: uid('act'),
                type: action.actionType,
                params: { ...defaultParams(action.actionType, wp), ...action.params },
              },
            ],
          };
        }),
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

interface RouteBuilderValue extends State {
  addWaypoint: (position: LatLng, name?: string, altitudeFt?: number) => void;
  removeWaypoint: (id: string) => void;
  moveWaypoint: (from: number, to: number) => void;
  updateWaypoint: (id: string, patch: Partial<BuilderWaypoint>) => void;
  selectWaypoint: (id: string | null) => void;
  setPlacing: (value: boolean) => void;
  addAction: (waypointId: string, actionType: WaypointActionType, params?: ActionParams) => void;
  updateAction: (waypointId: string, actionId: string, params: ActionParams) => void;
  removeAction: (waypointId: string, actionId: string) => void;
}

const RouteBuilderContext = createContext<RouteBuilderValue | null>(null);

// Provides route-builder state and actions to descendants.
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
    placing: false,
  });

  const actions = useMemo(
    () => ({
      addWaypoint: (position: LatLng, name?: string, altitudeFt?: number) =>
        dispatch({ type: 'addWaypoint', position, name, altitudeFt }),
      removeWaypoint: (id: string) => dispatch({ type: 'removeWaypoint', id }),
      moveWaypoint: (from: number, to: number) => dispatch({ type: 'moveWaypoint', from, to }),
      updateWaypoint: (id: string, patch: Partial<BuilderWaypoint>) =>
        dispatch({ type: 'updateWaypoint', id, patch }),
      selectWaypoint: (id: string | null) => dispatch({ type: 'selectWaypoint', id }),
      setPlacing: (value: boolean) => dispatch({ type: 'setPlacing', value }),
      addAction: (waypointId: string, actionType: WaypointActionType, params?: ActionParams) =>
        dispatch({ type: 'addAction', waypointId, actionType, params }),
      updateAction: (waypointId: string, actionId: string, params: ActionParams) =>
        dispatch({ type: 'updateAction', waypointId, actionId, params }),
      removeAction: (waypointId: string, actionId: string) =>
        dispatch({ type: 'removeAction', waypointId, actionId }),
    }),
    [],
  );

  const value = useMemo<RouteBuilderValue>(
    () => ({ ...state, ...actions }),
    [state, actions],
  );

  return (
    <RouteBuilderContext.Provider value={value}>
      {children}
    </RouteBuilderContext.Provider>
  );
};

// Reads the route-builder context, throwing if used outside its provider.
export const useRouteBuilder = (): RouteBuilderValue => {
  const ctx = useContext(RouteBuilderContext);
  if (!ctx) throw new Error('useRouteBuilder must be used within RouteBuilderProvider');
  return ctx;
};
