import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import type { LatLng } from '@/types/proto';
import { useMissionSession } from '@/api/msnsvr/MissionSessionContext';
import type {
  ActionParams,
  BuilderRoute,
  BuilderWaypoint,
  WaypointActionType,
} from '@/route/routeBuilderTypes';

const defaultParams = (type: WaypointActionType, _wp?: BuilderWaypoint): ActionParams =>
  type === 'hover' ? { durationSec: 120, altitudeFt: 50 } : {};

let seq = 0;
const uid = (prefix: string) => `${prefix}-${(seq += 1)}`;

interface State {
  route: BuilderRoute;
  selectedWaypointId: string | null;
  placing: boolean;
}

type Action =
  | { type: 'addWaypoint'; id: string; position: LatLng; name?: string; altitudeFt?: number }
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
        id: action.id,
        name:
          action.name?.trim() ||
          `${action.position.lat.toFixed(3)}, ${action.position.lng.toFixed(3)}`,
        position: action.position,
        altitudeFt: action.altitudeFt,
        actions: [],
      };
      // Don't auto-select on create — that would pop the edit panel open and
      // steal focus mid-typing. Selection happens on an explicit chip/marker click.
      return {
        ...state,
        route: { ...route, waypoints: [...route.waypoints, wp] },
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

  const { addPoint, setHover, setHoverDuration, setHoverHeight, clearHover } = useMissionSession();

  // Always-current view of the route so imperative action handlers can read a
  // waypoint's backend id and existing actions without stale-closure risk.
  const routeRef = useRef(state.route);
  routeRef.current = state.route;

  const actions = useMemo(
    () => ({
      addWaypoint: (position: LatLng, name?: string, altitudeFt?: number) => {
        const id = uid('wp');
        dispatch({ type: 'addWaypoint', id, position, name, altitudeFt });
        // Mirror the add to MsnSvr (create point + coordinate) and record the GUID
        // plus the service's default planned altitude.
        addPoint(position)
          .then(({ pointId, altitudeFt: planned, hover }) => {
            dispatch({
              type: 'updateWaypoint',
              id,
              patch: planned != null ? { serverId: pointId, altitudeFt: planned } : { serverId: pointId },
            });
            // The service defaulted this point to a hover — reflect it (with the
            // service's own dwell/height) in the UI. The backend already has it, so
            // no push is needed; adding the action triggers a recalc on its own.
            // Only carry values the service actually returned; the reducer fills
            // any gaps with the hover defaults.
            if (hover) {
              const params: ActionParams = {};
              if (hover.durationSec != null) params.durationSec = hover.durationSec;
              if (hover.heightFt != null) params.altitudeFt = hover.heightFt;
              dispatch({ type: 'addAction', waypointId: id, actionType: 'hover', params });
            }
          })
          .catch((e) => console.error('[msnsvr] addPointToCurrentRoute failed', e));
      },
      removeWaypoint: (id: string) => dispatch({ type: 'removeWaypoint', id }),
      moveWaypoint: (from: number, to: number) => dispatch({ type: 'moveWaypoint', from, to }),
      updateWaypoint: (id: string, patch: Partial<BuilderWaypoint>) =>
        dispatch({ type: 'updateWaypoint', id, patch }),
      selectWaypoint: (id: string | null) => dispatch({ type: 'selectWaypoint', id }),
      setPlacing: (value: boolean) => dispatch({ type: 'setPlacing', value }),
      addAction: (waypointId: string, actionType: WaypointActionType, params?: ActionParams) => {
        const wp = routeRef.current.waypoints.find((w) => w.id === waypointId);
        const already = (wp?.actions ?? []).some((a) => a.type === actionType);
        dispatch({ type: 'addAction', waypointId, actionType, params });
        // Mirror the hover to MsnSvr: set the point type, dwell time and height.
        // The route calc picks up the change and recalculates automatically.
        if (actionType === 'hover' && wp?.serverId && !already) {
          const p = { ...defaultParams('hover', wp), ...params };
          setHover(wp.serverId, p.durationSec ?? 0, p.altitudeFt ?? 0).catch((e) =>
            console.error('[msnsvr] setPointHover failed', e),
          );
        }
      },
      updateAction: (waypointId: string, actionId: string, params: ActionParams) => {
        const wp = routeRef.current.waypoints.find((w) => w.id === waypointId);
        const action = (wp?.actions ?? []).find((a) => a.id === actionId);
        dispatch({ type: 'updateAction', waypointId, actionId, params });
        // Push only the hover attribute that changed, so each input is independent.
        // A recalc follows automatically once the value lands on the backend.
        if (action?.type === 'hover' && wp?.serverId) {
          const serverId = wp.serverId;
          if (params.durationSec != null) {
            setHoverDuration(serverId, params.durationSec).catch((e) =>
              console.error('[msnsvr] setHoverDuration failed', e),
            );
          }
          if (params.altitudeFt != null) {
            setHoverHeight(serverId, params.altitudeFt).catch((e) =>
              console.error('[msnsvr] setHoverHeight failed', e),
            );
          }
        }
      },
      removeAction: (waypointId: string, actionId: string) => {
        const wp = routeRef.current.waypoints.find((w) => w.id === waypointId);
        const action = (wp?.actions ?? []).find((a) => a.id === actionId);
        dispatch({ type: 'removeAction', waypointId, actionId });
        // Revert the point to a normal turn so the recalc drops the hover.
        if (action?.type === 'hover' && wp?.serverId) {
          clearHover(wp.serverId).catch((e) =>
            console.error('[msnsvr] clearHover failed', e),
          );
        }
      },
    }),
    [addPoint, setHover, setHoverDuration, setHoverHeight, clearHover],
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
