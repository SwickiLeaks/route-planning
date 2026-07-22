/**
 * Proto-derived TypeScript interfaces.
 *
 * Hand-written for now to unblock the map. Once the service `.proto` files are
 * available these should be replaced by generated output — keep the names in
 * sync with the wire messages so the swap is mechanical.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Waypoint {
  id: string;
  name: string;
  position: LatLng;
  /** Planned altitude above mean sea level, in feet. */
  altitudeFt?: number;
}

export interface Route {
  id: string;
  name: string;
  waypoints: Waypoint[];
  /** Total planned distance in nautical miles. */
  distanceNm?: number;
  /** Estimated flight time in minutes. */
  durationMin?: number;
}
