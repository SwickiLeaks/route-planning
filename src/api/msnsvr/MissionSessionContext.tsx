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
  /** Planned airspeed in knots from the service, if it returned one. */
  speedKts?: number;
  /** Present when the service created this point as a hover by default. */
  hover?: { durationSec?: number; heightFt?: number };
}

// Fuel weight comes back as a bare SI number (kilograms). Parse the magnitude.
const fuelKgFrom = (raw: string): number | undefined => {
  const value = raw.includes(';') ? raw.slice(raw.lastIndexOf(';') + 1) : raw;
  const match = value.replace(/^raw/i, '').match(/-?\d+(?:\.\d+)?/);
  if (!match) return undefined;
  const kg = Number(match[0]);
  return Number.isFinite(kg) ? kg : undefined;
};

const MS_TO_KNOTS = 1.943844;

// Airspeed comes back like "…;raw51.44 m/s Knot": SI metres-per-second after the
// semicolon. Parse the magnitude and convert to whole knots.
const airspeedKnotsFrom = (raw: string): number | undefined => {
  const value = raw.includes(';') ? raw.slice(raw.indexOf(';') + 1) : raw;
  const match = value.match(/(-?\d+(?:\.\d+)?)\s*([a-zA-Z]+)?/);
  if (!match) return undefined;
  const magnitude = Number(match[1]);
  if (!Number.isFinite(magnitude)) return undefined;
  const unit = (match[2] ?? '').toLowerCase();
  const knots = unit.startsWith('m') ? magnitude * MS_TO_KNOTS : magnitude;
  return Math.round(knots);
};

// The full attribute set to stamp onto one fixed backend slot during a reorder.
export interface PointReorderUpdate {
  /** The backend point (slot) to overwrite. */
  serverId: string;
  position: LatLng;
  altitudeFt?: number;
  /** A hover to apply, or null to make the slot a normal (non-hover) point. */
  hover?: { durationSec: number; heightFt: number } | null;
}

// A hover duration comes back as a TimeDelta. Handle the "hh+mm+ss"/"hh:mm:ss"
// forms as well as a plain "<n> <unit>" (sec/min/hr); default the unit to seconds.
const hoverSecondsFrom = (raw: string): number | undefined => {
  const value = (raw.includes(';') ? raw.slice(raw.lastIndexOf(';') + 1) : raw)
    .trim()
    .replace(/^raw/i, '')
    .trim();
  if (!value) return undefined;
  const parts = value.split(/[+:]/);
  if (parts.length === 3 && parts.every((p) => /^\d+$/.test(p.trim()))) {
    const [h, m, s] = parts.map(Number);
    return h * 3600 + m * 60 + s;
  }
  const match = value.match(/(-?\d+(?:\.\d+)?)\s*([a-zA-Z]+)?/);
  if (!match) return undefined;
  const magnitude = Number(match[1]);
  if (!Number.isFinite(magnitude)) return undefined;
  const unit = (match[2] ?? '').toLowerCase();
  const factor = unit.startsWith('h') ? 3600 : unit.startsWith('m') ? 60 : 1;
  return Math.round(magnitude * factor);
};

const METERS_TO_FEET = 3.280839895;

// Altitude comes back like "something;raw15.24 m Foot AGL": the value follows the
// semicolon and is in meters. Parse the magnitude and convert to whole feet.
const altitudeFeetFrom = (raw: string): number | undefined => {
  const value = raw.includes(';') ? raw.slice(raw.indexOf(';') + 1) : raw;
  const match = value.match(/(-?\d+(?:\.\d+)?)\s*([a-zA-Z]+)?/);
  if (!match) return undefined;
  const magnitude = Number(match[1]);
  if (!Number.isFinite(magnitude)) return undefined;
  const unit = (match[2] ?? '').toLowerCase();
  const feet = unit.startsWith('m') ? magnitude * METERS_TO_FEET : magnitude;
  return Math.round(feet);
};

// Seconds → the service's "hh+mm+ss" TimeDelta string, e.g. 300 → "00+05+00".
const toHoverDuration = (seconds: number): string => {
  const total = Math.max(0, Math.round(seconds));
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(Math.floor(total / 3600))}+${pad(Math.floor((total % 3600) / 60))}+${pad(total % 60)}`;
};

// Feet AGL → the service's AltitudeAGL string, e.g. 50 → "50A".
const toHoverHeight = (feet: number): string => `${Math.round(feet)}A`;

// Feet AGL → the service's InputAltitude string, e.g. 500 → "500 A".
const toMsnSvrAltitude = (feet: number): string => `${Math.round(feet)} A`;

export interface MissionSession {
  /** Backend-assigned mission GUID. */
  missionId: string;
  /** Backend-assigned route GUID. */
  routeId: string;
  /** The route's starting fuel weight in kilograms, once read (null until then). */
  startingFuelKg: number | null;
  status: MissionSessionStatus;
  error: unknown;
  ready: boolean;
  /** Appends a route point, sets its coordinate, reads its planned altitude. */
  addPoint: (position: LatLng) => Promise<AddedPoint>;
  /** Removes the route point at the given index from the backend. */
  deletePoint: (index: number) => Promise<void>;
  /** Turns a point into a hover with the given dwell time and height AGL. */
  setHover: (pointId: string, durationSec: number, heightFt: number) => Promise<void>;
  /** Sets only the dwell time on a point's hover. */
  setHoverDuration: (pointId: string, durationSec: number) => Promise<void>;
  /** Sets only the height on a point's hover. */
  setHoverHeight: (pointId: string, heightFt: number) => Promise<void>;
  /** Reverts a hover point back to a normal turn point. */
  clearHover: (pointId: string) => Promise<void>;
  /** Overwrites fixed backend slots to realise a UI reorder (the service can't
   *  move points, so we swap their attribute values instead). */
  reorderPoints: (updates: PointReorderUpdate[]) => Promise<void>;
  /** Runs a calculation and returns the given attributes per point, keyed by point GUID. */
  calculatePoints: (
    pointIds: string[],
    attributeIds: string[],
  ) => Promise<Record<string, Record<string, string>>>;
}

const MissionSessionContext = createContext<MissionSession | null>(null);

// Owns the demo's mission/route session: creates them once on startup and
// serialises route-point mutations so the backend order matches the UI.
export const MissionSessionProvider = ({ children }: { children: ReactNode }) => {
  const [missionId, setMissionId] = useState('');
  const [routeId, setRouteId] = useState('');
  const [startingFuelKg, setStartingFuelKg] = useState<number | null>(null);
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
      .then(async ({ missionId, routeId }) => {
        setMissionId(missionId);
        setRouteId(routeId);
        // Read the session's starting fuel weight once (constant for the session).
        try {
          const raw = await missionClient.getStartingFuelWeight();
          const kg = fuelKgFrom(raw);
          console.log('[fuel] starting fuel weight (raw):', raw, '→ kg:', kg);
          if (kg != null) setStartingFuelKg(kg);
        } catch (e) {
          console.error('[fuel] failed to read starting fuel weight', e);
        }
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
        // Read the service's default planned airspeed (knots) for this point.
        let speedKts: number | undefined;
        try {
          speedKts = airspeedKnotsFrom(await missionClient.getPointSpeed(pointId));
        } catch (e) {
          console.error('[msnsvr] getPointSpeed failed', e);
        }
        // The service may create a point as a hover by default (a hover event is
        // already on it). Detect that and read its height/duration so the UI can
        // reflect the hover action, with its real values, without the user adding it.
        let hover: AddedPoint['hover'];
        try {
          const raw = await missionClient.getPointHover(pointId);
          if (raw) {
            hover = {
              heightFt: altitudeFeetFrom(raw.height),
              durationSec: hoverSecondsFrom(raw.duration),
            };
          }
        } catch (e) {
          console.error('[msnsvr] getPointHover failed', e);
        }
        return { pointId, altitudeFt, speedKts, hover };
      });
    queue.current = run;
    return run;
  }, []);

  const deletePoint = useCallback((index: number): Promise<void> => {
    const run = queue.current
      .catch(() => {})
      .then(async () => {
        await readyRef.current;
        await missionClient.deletePointFromCurrentRoute(index);
      });
    queue.current = run;
    return run;
  }, []);

  const setHover = useCallback(
    (pointId: string, durationSec: number, heightFt: number): Promise<void> => {
      const run = queue.current
        .catch(() => {})
        .then(async () => {
          await readyRef.current;
          await missionClient.setPointHover(
            pointId,
            toHoverDuration(durationSec),
            toHoverHeight(heightFt),
          );
        });
      queue.current = run;
      return run;
    },
    [],
  );

  const setHoverDuration = useCallback((pointId: string, durationSec: number): Promise<void> => {
    const run = queue.current
      .catch(() => {})
      .then(async () => {
        await readyRef.current;
        await missionClient.setPointHoverDuration(pointId, toHoverDuration(durationSec));
      });
    queue.current = run;
    return run;
  }, []);

  const setHoverHeight = useCallback((pointId: string, heightFt: number): Promise<void> => {
    const run = queue.current
      .catch(() => {})
      .then(async () => {
        await readyRef.current;
        await missionClient.setPointHoverHeight(pointId, toHoverHeight(heightFt));
      });
    queue.current = run;
    return run;
  }, []);

  const clearHover = useCallback((pointId: string): Promise<void> => {
    const run = queue.current
      .catch(() => {})
      .then(async () => {
        await readyRef.current;
        await missionClient.setPointTypeToNormalTurn(pointId);
      });
    queue.current = run;
    return run;
  }, []);

  const reorderPoints = useCallback((updates: PointReorderUpdate[]): Promise<void> => {
    const run = queue.current
      .catch(() => {})
      .then(async () => {
        await readyRef.current;
        // Each slot is rewritten in full: coordinate, altitude, and its event
        // (a hover, or reverted to a normal point). Failures are isolated so one
        // bad attribute doesn't abort the rest of the swap.
        for (const u of updates) {
          try {
            await missionClient.setPointCoordinate(u.serverId, toMsnSvrCoordinate(u.position));
          } catch (e) {
            console.error('[msnsvr] reorder setPointCoordinate failed', e);
          }
          if (u.altitudeFt != null) {
            try {
              await missionClient.setPointAltitude(u.serverId, toMsnSvrAltitude(u.altitudeFt));
            } catch (e) {
              console.error('[msnsvr] reorder setPointAltitude failed', e);
            }
          }
          try {
            if (u.hover) {
              await missionClient.setPointHover(
                u.serverId,
                toHoverDuration(u.hover.durationSec),
                toHoverHeight(u.hover.heightFt),
              );
            } else {
              await missionClient.setPointTypeToNormalTurn(u.serverId);
            }
          } catch (e) {
            console.error('[msnsvr] reorder event swap failed', e);
          }
        }
      });
    queue.current = run;
    return run;
  }, []);

  const calculatePoints = useCallback(
    (pointIds: string[], attributeIds: string[]): Promise<Record<string, Record<string, string>>> => {
      const run = queue.current
        .catch(() => {})
        .then(async (): Promise<Record<string, Record<string, string>>> => {
          await readyRef.current;
          await missionClient.calculateAndWait();
          const byPoint: Record<string, Record<string, string>> = {};
          for (const pointId of pointIds) {
            try {
              const attrs = await missionClient.getPointCalcAttributes(pointId, attributeIds);
              if (Object.keys(attrs).length) byPoint[pointId] = attrs;
            } catch (e) {
              console.error('[msnsvr] getPointCalcAttributes failed', e);
            }
          }
          return byPoint;
        });
      queue.current = run;
      return run;
    },
    [],
  );

  const value = useMemo<MissionSession>(
    () => ({
      missionId,
      routeId,
      startingFuelKg,
      status,
      error,
      ready: status === 'ready',
      addPoint,
      deletePoint,
      setHover,
      setHoverDuration,
      setHoverHeight,
      clearHover,
      reorderPoints,
      calculatePoints,
    }),
    [
      missionId,
      routeId,
      startingFuelKg,
      status,
      error,
      addPoint,
      deletePoint,
      setHover,
      setHoverDuration,
      setHoverHeight,
      clearHover,
      reorderPoints,
      calculatePoints,
    ],
  );

  return <MissionSessionContext.Provider value={value}>{children}</MissionSessionContext.Provider>;
};

// Reads the mission session, throwing if used outside its provider.
export const useMissionSession = (): MissionSession => {
  const ctx = useContext(MissionSessionContext);
  if (!ctx) throw new Error('useMissionSession must be used within MissionSessionProvider');
  return ctx;
};
