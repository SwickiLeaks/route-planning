import type { LatLng } from '@/types/proto';

// One axis as "<hemisphere> <whole degrees> <decimal minutes>", e.g. "N 33 10.00".
// Minutes are zero-padded to two integer digits ("07.00"), matching the service.
const component = (value: number, positive: string, negative: string): string => {
  const hemisphere = value >= 0 ? positive : negative;
  const abs = Math.abs(value);
  let degrees = Math.floor(abs);
  let minutes = (abs - degrees) * 60;
  // Guard the boundary where minutes round up to 60.
  if (Math.round(minutes * 100) >= 6000) {
    degrees += 1;
    minutes = 0;
  }
  return `${hemisphere} ${degrees} ${minutes.toFixed(2).padStart(5, '0')}`;
};

// Formats a lat/lng as the MsnSvr coordinate string, e.g. "N 33 10.00/W 95 30.00".
export const toMsnSvrCoordinate = ({ lat, lng }: LatLng): string =>
  `${component(lat, 'N', 'S')}/${component(lng, 'E', 'W')}`;
