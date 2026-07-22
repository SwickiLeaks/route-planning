import { useMemo } from 'react';
import { Layer, Source } from 'react-map-gl/maplibre';
import type { Route } from '@/types/proto';
import { routesToLines, routesToWaypoints } from '@/map/routes';

interface RouteLayersProps {
  routes: Route[];
}

const RouteLayers = ({ routes }: RouteLayersProps) => {
  const lines = useMemo(() => routesToLines(routes), [routes]);
  const waypoints = useMemo(() => routesToWaypoints(routes), [routes]);

  return (
    <>
      <Source id="routes" type="geojson" data={lines}>
        {/* Dark casing first, so the route stays legible over bright terrain. */}
        <Layer
          id="route-casing"
          type="line"
          layout={{ 'line-cap': 'round', 'line-join': 'round' }}
          paint={{
            'line-color': '#000000',
            'line-opacity': 0.7,
            'line-width': 6,
          }}
        />
        <Layer
          id="route-line"
          type="line"
          layout={{ 'line-cap': 'round', 'line-join': 'round' }}
          paint={{
            'line-color': ['get', 'color'],
            'line-width': 2.5,
          }}
        />
      </Source>

      <Source id="waypoints" type="geojson" data={waypoints}>
        <Layer
          id="waypoint-dot"
          type="circle"
          paint={{
            'circle-radius': 4,
            'circle-color': ['get', 'color'],
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#0f1115',
          }}
        />
        <Layer
          id="waypoint-label"
          type="symbol"
          layout={{
            'text-field': ['get', 'name'],
            'text-font': ['Noto Sans Medium'],
            'text-size': 11,
            'text-offset': [0, 1.1],
            'text-anchor': 'top',
            // Drop labels rather than overlap them when zoomed out.
            'text-optional': true,
          }}
          paint={{
            'text-color': '#e6e8eb',
            'text-halo-color': '#0f1115',
            'text-halo-width': 1.5,
          }}
        />
      </Source>
    </>
  );
};

export default RouteLayers;
