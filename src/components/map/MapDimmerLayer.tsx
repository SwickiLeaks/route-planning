import { Layer, Source } from 'react-map-gl/maplibre';
import type { FeatureCollection } from 'geojson';
import { useMapSettings } from '@/components/map/MapSettingsContext';

// A world-covering polygon; a black fill over it dims whatever renders below.
const WORLD: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[[-180, -85], [180, -85], [180, 85], [-180, 85], [-180, -85]]],
      },
    },
  ],
};

// A dim layer rendered inside the map. Mounted before the route/waypoint layers
// so it sits above the basemap but below them — dimming only the basemap, leaving
// the route line and waypoints at full brightness.
const MapDimmerLayer = () => {
  const { dim } = useMapSettings();
  return (
    <Source id="map-dimmer" type="geojson" data={WORLD}>
      <Layer id="map-dimmer-fill" type="fill" paint={{ 'fill-color': '#000', 'fill-opacity': dim }} />
    </Source>
  );
};

export default MapDimmerLayer;
