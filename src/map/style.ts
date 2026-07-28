import { layers, namedFlavor } from '@protomaps/basemaps';
import type { LayerSpecification, StyleSpecification } from 'maplibre-gl';
import { DETAIL_MIN_ZOOM } from '@/map/region';
import { mapAccents } from '@/theme/tokens';

const BASEMAP_URL = 'pmtiles:///map/basemap.pmtiles';
const CONTEXT_URL = 'pmtiles:///map/context.pmtiles';
const TERRAIN_URL = 'pmtiles:///map/terrain.pmtiles';

const GLYPHS_URL = '/map/fonts/{fontstack}/{range}.pbf';

const BASEMAP_SOURCE = 'protomaps';
const CONTEXT_SOURCE = 'protomaps-context';
const TERRAIN_SOURCE = 'terrain';

export { INITIAL_VIEW, MAX_BOUNDS, REGION_LABEL } from '@/map/region';

const ATTRIBUTION_BASEMAP =
  '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>';
const ATTRIBUTION_TERRAIN =
  '<a href="https://mapterhorn.com/attribution">© Mapterhorn</a>';

const flavor = namedFlavor('black');

const hillshadeLayer: LayerSpecification = {
  id: 'terrain-hillshade',
  type: 'hillshade',
  source: TERRAIN_SOURCE,
  minzoom: DETAIL_MIN_ZOOM,
  paint: {
    'hillshade-exaggeration': 0.6,
    'hillshade-shadow-color': mapAccents.hillshadeShadow,
    'hillshade-highlight-color': mapAccents.hillshadeHighlight,
    'hillshade-accent-color': mapAccents.hillshadeAccent,
    'hillshade-illumination-direction': 315,
  },
};

// Context layers, prefixed to keep ids unique and labels capped at the handoff.
const contextLayers = (): LayerSpecification[] =>
  layers(CONTEXT_SOURCE, flavor, { lang: 'en' }).map((layer) => ({
    ...layer,
    id: `context-${layer.id}`,
    ...(layer.type === 'symbol' ? { maxzoom: DETAIL_MIN_ZOOM } : {}),
  }));

// Full-detail layers, hidden below the handoff and stripped of the background.
const detailLayers = (): LayerSpecification[] =>
  layers(BASEMAP_SOURCE, flavor, { lang: 'en' })
    .filter((layer) => layer.type !== 'background')
    .map((layer) => ({
      ...layer,
      minzoom: Math.max(layer.minzoom ?? 0, DETAIL_MIN_ZOOM),
    }));

// Inserts the hillshade above the landmass fill but below roads and labels.
const withHillshade = (base: LayerSpecification[]): LayerSpecification[] => {
  const firstRoad = base.findIndex((layer) => layer.id.startsWith('roads'));
  const insertAt = firstRoad === -1 ? base.length : firstRoad;

  return [...base.slice(0, insertAt), hillshadeLayer, ...base.slice(insertAt)];
};

// Builds the full MapLibre style spec for the map.
export const buildMapStyle = (): StyleSpecification => ({
  version: 8,
  glyphs: GLYPHS_URL,
  sources: {
    [CONTEXT_SOURCE]: {
      type: 'vector',
      url: CONTEXT_URL,
      attribution: ATTRIBUTION_BASEMAP,
    },
    [BASEMAP_SOURCE]: {
      type: 'vector',
      url: BASEMAP_URL,
      attribution: ATTRIBUTION_BASEMAP,
    },
    [TERRAIN_SOURCE]: {
      type: 'raster-dem',
      url: TERRAIN_URL,
      encoding: 'terrarium',
      tileSize: 512,
      attribution: ATTRIBUTION_TERRAIN,
    },
  },
  layers: [...contextLayers(), ...withHillshade(detailLayers())],
});
