import type { LatLng } from '@/types/proto';

const EARTH_RADIUS_M = 6_371_000;
const M_PER_NM = 1852;

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

/** Great-circle distance between two points, in nautical miles. */
export const distanceNm = (a: LatLng, b: LatLng): number => {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return (2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h))) / M_PER_NM;
};

/** Initial great-circle bearing from a to b, in degrees (0–360, true). */
export const bearingDeg = (a: LatLng, b: LatLng): number => {
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const dLng = toRad(b.lng - a.lng);

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  return (toDeg(Math.atan2(y, x)) + 360) % 360;
};

/** Midpoint of a leg (planar average — fine at tour-leg distances). */
export const midpoint = (a: LatLng, b: LatLng): LatLng => ({
  lat: (a.lat + b.lat) / 2,
  lng: (a.lng + b.lng) / 2,
});
