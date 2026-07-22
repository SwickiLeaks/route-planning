import type { Feature, FeatureCollection, LineString, Point } from 'geojson';
import type { Route } from '@/types/proto';

/** Distinct, high-contrast against the dark flavor and the hillshade beneath. */
const ROUTE_COLORS = ['#ffb703', '#4cc9f0', '#f72585', '#90be6d'];

/** Shared with the route panel so its swatches match the lines on the map. */
export const routeColor = (index: number) =>
  ROUTE_COLORS[index % ROUTE_COLORS.length];

/** Route paths, one LineString per route. */
export const routesToLines = (routes: Route[]): FeatureCollection<LineString> => ({
  type: 'FeatureCollection',
  features: routes.map((route, index): Feature<LineString> => ({
    type: 'Feature',
    id: route.id,
    geometry: {
      type: 'LineString',
      coordinates: route.waypoints.map((w) => [w.position.lng, w.position.lat]),
    },
    properties: {
      routeId: route.id,
      name: route.name,
      color: routeColor(index),
    },
  })),
});

/**
 * Waypoint markers, flattened across all routes. The return leg of a loop
 * repeats its origin, so dedupe by position to avoid stacking a marker and its
 * label on top of themselves.
 */
export const routesToWaypoints = (routes: Route[]): FeatureCollection<Point> => {
  const seen = new Set<string>();
  const features: Feature<Point>[] = [];

  routes.forEach((route, index) => {
    for (const waypoint of route.waypoints) {
      const key = `${route.id}:${waypoint.position.lng},${waypoint.position.lat}`;
      if (seen.has(key)) continue;
      seen.add(key);

      features.push({
        type: 'Feature',
        id: `${route.id}:${waypoint.id}`,
        geometry: {
          type: 'Point',
          coordinates: [waypoint.position.lng, waypoint.position.lat],
        },
        properties: {
          routeId: route.id,
          name: waypoint.name,
          altitudeFt: waypoint.altitudeFt ?? null,
          color: routeColor(index),
        },
      });
    }
  });

  return { type: 'FeatureCollection', features };
};
