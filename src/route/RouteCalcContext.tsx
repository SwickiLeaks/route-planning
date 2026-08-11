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
import { useRouteBuilder } from '@/route/RouteBuilderContext';
import { useMissionSession } from '@/api/msnsvr/MissionSessionContext';
import { CalcPointAttribute } from '@/api/msnsvr/missionClient';

export type RouteCalcStatus = 'idle' | 'calculating' | 'done' | 'error';

interface RouteCalcValue {
  status: RouteCalcStatus;
  /** A calculated attribute for a waypoint (undefined until available). */
  value: (waypointId: string, attributeId: string) => string | undefined;
  /** A calculated attribute from the last point, which carries route totals. */
  total: (attributeId: string) => string | undefined;
  /** Starting fuel minus the fuel consumed at a waypoint, formatted (lbs). */
  fuelRemainingAt: (waypointId: string) => string | undefined;
  /** Fuel remaining at the last point (i.e. at the end of the route). */
  fuelRemaining: string | undefined;
}

interface CalcResult {
  points: Record<string, Record<string, string>>; // waypoint local id → attr → raw value
  lastId: string | null; // last waypoint's local id (holds route totals)
}

const RouteCalcContext = createContext<RouteCalcValue | null>(null);

const DEBOUNCE_MS = 800;
// Calculated attributes fetched per point. Add entries to CalcPointAttribute.
const ATTRIBUTES = Object.values(CalcPointAttribute);

// Strips the "<something>;" prefix (and a leading "raw") the service prepends.
const displayValue = (raw: string): string => {
  const idx = raw.lastIndexOf(';');
  return (idx >= 0 ? raw.slice(idx + 1) : raw).trim().replace(/^raw/i, '');
};

// Pulls the leading number out of a "123.456 …" value.
const leadingNumber = (value: string): number | undefined => {
  const match = value.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : undefined;
};

// Seconds (possibly fractional) → "hh+mm+ss".
const formatHMS = (value: string): string => {
  const seconds = leadingNumber(value);
  if (seconds == null) return value;
  const total = Math.max(0, Math.round(seconds));
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(Math.floor(total / 3600))}+${pad(Math.floor((total % 3600) / 60))}+${pad(total % 60)}`;
};

// Meters → nautical miles to a tenth: "12.3 nm".
const formatNm = (value: string): string => {
  const meters = leadingNumber(value);
  return meters == null ? value : `${(meters / 1852).toFixed(1)} nm`;
};

const KG_TO_LB = 2.2046226;

// Kilograms → pounds, rounded: "1,234 lbs".
const formatLbs = (value: string): string => {
  const kg = leadingNumber(value);
  return kg == null ? value : `${Math.round(kg * KG_TO_LB).toLocaleString()} lbs`;
};

// Per-attribute display formatting; attributes without an entry show as-is.
const FORMATTERS: Record<string, (value: string) => string> = {
  [CalcPointAttribute.LegTime]: formatHMS, // service returns seconds
  [CalcPointAttribute.LegDist]: formatNm, // service returns meters
  [CalcPointAttribute.LegFuel]: formatLbs, // service returns kilograms
  [CalcPointAttribute.RouteTime]: formatHMS,
  [CalcPointAttribute.RouteDistance]: formatNm,
  [CalcPointAttribute.SegmentFuel]: formatLbs, // service returns kilograms
};

// Runs a backend calculation when the route settles and exposes the results.
export const RouteCalcProvider = ({ children }: { children: ReactNode }) => {
  const { route } = useRouteBuilder();
  const { ready, calculatePoints, startingFuelKg } = useMissionSession();
  const [result, setResult] = useState<CalcResult>({ points: {}, lastId: null });
  const [status, setStatus] = useState<RouteCalcStatus>('idle');
  const runId = useRef(0);

  const waypoints = route.waypoints;
  // Recalculate when a waypoint is added, removed, or edited (coordinate/altitude/
  // backend id) or its hover changes. A reorder swaps the values held by the fixed
  // backend slots, so each waypoint id ends up paired with a different serverId —
  // that changes this signature too, which is exactly when we want to recalc.
  const signature = waypoints
    .map((w) => {
      const acts = (w.actions ?? [])
        .map((a) => `${a.type}/${a.params?.durationSec ?? ''}/${a.params?.altitudeFt ?? ''}`)
        .join(',');
      return `${w.id}:${w.serverId ?? ''}:${w.position.lat},${w.position.lng}:${w.altitudeFt ?? ''}:${acts}`;
    })
    .sort()
    .join('|');
  // Need at least a leg, and every point mirrored to the backend.
  const allSynced = waypoints.length >= 2 && waypoints.every((w) => w.serverId);

  useEffect(() => {
    if (!ready || !allSynced) return;
    const myRun = ++runId.current;
    setStatus('calculating');

    const timer = setTimeout(async () => {
      try {
        // Exclude the origin — it has no inbound leg / calculated point.
        const targets = waypoints.slice(1);
        const serverIds = targets.map((w) => w.serverId as string);
        const byServer = await calculatePoints(serverIds, ATTRIBUTES);
        if (myRun !== runId.current) return; // a newer run superseded this one

        const points: Record<string, Record<string, string>> = {};
        for (const w of targets) {
          const attrs = w.serverId ? byServer[w.serverId] : undefined;
          if (attrs) points[w.id] = attrs;
        }
        setResult({ points, lastId: waypoints[waypoints.length - 1]?.id ?? null });
        setStatus('done');
      } catch (e) {
        if (myRun !== runId.current) return;
        console.error('[msnsvr] route calculation failed', e);
        setStatus('error');
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
    // waypoints is captured via `signature`, which changes with any relevant edit.
  }, [signature, allSynced, ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useCallback(
    (waypointId: string, attributeId: string): string | undefined => {
      const raw = result.points[waypointId]?.[attributeId];
      if (!raw) return undefined;
      const stripped = displayValue(raw);
      if (!stripped) return undefined;
      return (FORMATTERS[attributeId] ?? ((v) => v))(stripped);
    },
    [result],
  );

  const total = useCallback(
    (attributeId: string): string | undefined =>
      result.lastId ? value(result.lastId, attributeId) : undefined,
    [result, value],
  );

  // Fuel remaining = starting fuel − cumulative fuel consumed at the point
  // (StateSegmentFuel). Both are kilograms; display in pounds like other fuel.
  const fuelRemainingAt = useCallback(
    (waypointId: string): string | undefined => {
      if (startingFuelKg == null) return undefined;
      const rawConsumed = result.points[waypointId]?.[CalcPointAttribute.SegmentFuel];
      if (!rawConsumed) return undefined;
      const consumedKg = leadingNumber(displayValue(rawConsumed));
      if (consumedKg == null) return undefined;
      return `${Math.round((startingFuelKg - consumedKg) * KG_TO_LB).toLocaleString()} lbs`;
    },
    [startingFuelKg, result],
  );

  const fuelRemaining = useMemo<string | undefined>(
    () => (result.lastId ? fuelRemainingAt(result.lastId) : undefined),
    [fuelRemainingAt, result.lastId],
  );

  const ctx = useMemo<RouteCalcValue>(
    () => ({ status, value, total, fuelRemainingAt, fuelRemaining }),
    [status, value, total, fuelRemainingAt, fuelRemaining],
  );

  return <RouteCalcContext.Provider value={ctx}>{children}</RouteCalcContext.Provider>;
};

// Reads calculated route results, throwing if used outside its provider.
export const useRouteCalc = (): RouteCalcValue => {
  const ctx = useContext(RouteCalcContext);
  if (!ctx) throw new Error('useRouteCalc must be used within RouteCalcProvider');
  return ctx;
};
