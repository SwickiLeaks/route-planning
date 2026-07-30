import type { LatLng } from '@/types/proto';

export interface Airport {
  code: string;
  name: string;
  position: LatLng;
}

// Temporary Middle-Tennessee airport table, used to resolve typed codes to real
// coordinates until the POI/airport service (src/api) is wired up.
export const AIRPORTS: Airport[] = [
  { code: 'KBNA', name: 'Nashville International', position: { lat: 36.1245, lng: -86.6782 } },
  { code: 'KJWN', name: 'John C. Tune', position: { lat: 36.1824, lng: -86.8866 } },
  { code: 'KMQY', name: 'Smyrna / Rutherford County', position: { lat: 36.0090, lng: -86.5202 } },
  { code: 'KCKV', name: 'Clarksville — Outlaw Field', position: { lat: 36.6219, lng: -87.4150 } },
  { code: 'KHOP', name: 'Campbell AAF — Fort Campbell', position: { lat: 36.6685, lng: -87.4962 } },
  { code: 'M02', name: 'Dickson Municipal', position: { lat: 36.0781, lng: -87.4028 } },
  { code: 'M91', name: 'Springfield — Robertson County', position: { lat: 36.5325, lng: -86.9205 } },
  { code: 'KMBT', name: 'Murfreesboro Municipal', position: { lat: 35.8785, lng: -86.3752 } },
  { code: 'M33', name: 'Gallatin — Sumner County', position: { lat: 36.3824, lng: -86.4092 } },
  { code: 'M54', name: 'Lebanon Municipal', position: { lat: 36.1902, lng: -86.3273 } },
];

const byCode = new Map(AIRPORTS.map((a) => [a.code.toUpperCase(), a]));

// Resolves an airport by code (case-insensitive), or undefined if unknown.
export const lookupAirport = (code: string): Airport | undefined =>
  byCode.get(code.trim().toUpperCase());
