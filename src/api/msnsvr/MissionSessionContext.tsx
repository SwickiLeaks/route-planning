import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { missionClient } from '@/api/msnsvr/missionClient';
import { toMsnSvrCoordinate } from '@/api/msnsvr/coordinates';
import type { LatLng } from '@/types/proto';

export type MissionSessionStatus = 'initializing' | 'ready' | 'error';

export interface AddedPoint {
  /** Backend-assigned RoutePoint GUID. */
  pointId: string;
  /** Planned altitude in feet from the service, if it returned one. */
  altitudeFt?: number;
}

// Pulls the leading number out of the service's altitude string (e.g. "1500 A").
const altitudeFeetFrom = (raw: string): number | undefined => {
  const match = raw.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : undefined;
};

export interface MissionSession {
  /** Backend-assigned mission GUID. */
  missionId: string;
  /** Backend-assigned route GUID. */
  routeId: string;
  status: MissionSessionStatus;
  error: unknown;
  ready: boolean;
  /** Appends a route point, sets its coordinate, reads its planned altitude. */
  addPoint: (position: LatLng) => Promise<AddedPoint>;
}

const MissionSessionContext = createContext<MissionSession | null>(null);

// Owns the demo's mission/route session: creates them once on startup and
// serialises route-point mutations so the backend order matches the UI.
export const MissionSessionProvider = ({ children }: { children: ReactNode }) => {
  const [missionId, setMissionId] = useState('');
  const [routeId, setRouteId] = useState('');
  const [status, setStatus] = useState<MissionSessionStatus>('initializing');
  const [error, setError] = useState<unknown>(null);

  const started = useRef(false);
  // Resolves once mission + route exist; backend mutations await it.
  const readyRef = useRef<Promise<void>>(Promise.resolve());
  // Chains backend mutations so they run one at a time, in call order.
  const queue = useRef<Promise<unknown>>(Promise.resolve());

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    readyRef.current = missionClient
      .createMissionAndRoute()
      .then(({ missionId, routeId }) => {
        setMissionId(missionId);
        setRouteId(routeId);
        setStatus('ready');
      })
      .catch((e) => {
        console.error('[msnsvr] failed to create mission/route', e);
        setError(e);
        setStatus('error');
        throw e;
      });
  }, []);

  const addPoint = useCallback((position: LatLng): Promise<AddedPoint> => {
    const run = queue.current
      .catch(() => {}) // isolate one op's failure from the next
      .then(async (): Promise<AddedPoint> => {
        await readyRef.current; // mission/route must exist first
        const pointId = await missionClient.addPointToCurrentRoute();
        // Push the coordinate; keep the id even if this fails so the UI stays linked.
        try {
          await missionClient.setPointCoordinate(pointId, toMsnSvrCoordinate(position));
        } catch (e) {
          console.error('[msnsvr] setPointCoordinate failed', e);
        }
        // Read the service's default planned altitude for this point.
        let altitudeFt: number | undefined;
        try {
          altitudeFt = altitudeFeetFrom(await missionClient.getPointPlannedAltitude(pointId));
        } catch (e) {
          console.error('[msnsvr] getPointPlannedAltitude failed', e);
        }
        return { pointId, altitudeFt };
      });
    queue.current = run;
    return run;
  }, []);

  const value = useMemo<MissionSession>(
    () => ({ missionId, routeId, status, error, ready: status === 'ready', addPoint }),
    [missionId, routeId, status, error, addPoint],
  );

  return <MissionSessionContext.Provider value={value}>{children}</MissionSessionContext.Provider>;
};

// Reads the mission session, throwing if used outside its provider.
export const useMissionSession = (): MissionSession => {
  const ctx = useContext(MissionSessionContext);
  if (!ctx) throw new Error('useMissionSession must be used within MissionSessionProvider');
  return ctx;
};
