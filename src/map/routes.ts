import { mapAccents } from "@/theme/tokens";
import type { Route } from "@/types/proto";
import type { Feature, FeatureCollection, LineString, Point } from "geojson";

// Route colors from theme
const ROUTE_COLORS = mapAccents.routeColors;

// Route color assignment
export const routeColor = (index: number) =>
  ROUTE_COLORS[index % ROUTE_COLORS.length];

// Need to convert routes to "lines" that GeoJSON understands
export const routesToLines = (
  routes: Route[],
): FeatureCollection<LineString> => ({
  type: "FeatureCollection",
  features: routes.map(
    (route, index): Feature<LineString> => ({
      type: "Feature",
      id: route.id,
      geometry: {
        type: "LineString",
        coordinates: route.waypoints.map((w) => [
          w.position.lng,
          w.position.lat,
        ]),
      },
      properties: {
        routeId: route.id,
        name: route.name,
        color: routeColor(index),
      },
    }),
  ),
});

// Need to convert routes to "waypoints" that GeoJSON understands
// Clunky way of avoiding overlapping waypoints.
export const routesToWaypoints = (
  routes: Route[],
): FeatureCollection<Point> => {
  const seen = new Set<string>();
  const features: Feature<Point>[] = [];

  routes.forEach((route, index) => {
    for (const waypoint of route.waypoints) {
      const key = `${route.id}:${waypoint.position.lng},${waypoint.position.lat}`;
      if (seen.has(key)) continue;
      seen.add(key);

      features.push({
        type: "Feature",
        id: `${route.id}:${waypoint.id}`,
        geometry: {
          type: "Point",
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

  return { type: "FeatureCollection", features };
};
