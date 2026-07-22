import { layers, namedFlavor } from '@protomaps/basemaps';
import type { LayerSpecification, StyleSpecification } from 'maplibre-gl';
import { DETAIL_MIN_ZOOM } from '@/map/region';

/**
 * Everything the map needs is served from public/map/ — no runtime network
 * calls. Run `npm run map:fetch` to (re)generate the .pmtiles archives.
 *
 * Filenames are region-neutral, so switching regions is a script run rather
 * than a code change. Camera constants live in the generated region.ts.
 */
const BASEMAP_URL = 'pmtiles:///map/basemap.pmtiles';
const CONTEXT_URL = 'pmtiles:///map/context.pmtiles';
const TERRAIN_URL = 'pmtiles:///map/terrain.pmtiles';

/** MapLibre fetches label glyphs over HTTP; point it at our vendored subset. */
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
  // The DEM extract only covers the detail region. Below the handoff its
  // low-zoom parent tiles would shade one lonely rectangle of the continent.
  minzoom: DETAIL_MIN_ZOOM,
  paint: {
    // Tuned for the dark flavor: relief should read as depth, not haze.
    'hillshade-exaggeration': 0.6,
    'hillshade-shadow-color': '#000000',
    'hillshade-highlight-color': '#8fa3b0',
    'hillshade-accent-color': '#1b2b36',
    'hillshade-illumination-direction': 315,
  },
};

/**
 * Layer ids must be unique across the style, but `layers()` generates the same
 * ids for both sources — so the context set gets prefixed.
 *
 * Context geometry is left uncapped so it keeps drawing (overzoomed) outside
 * the detail bbox, which is what stops high-zoom panning from hitting a void.
 * Its *labels* are capped at the handoff, otherwise every town would render
 * twice once the detail source kicks in.
 */
const contextLayers = (): LayerSpecification[] =>
  layers(CONTEXT_SOURCE, flavor, { lang: 'en' }).map((layer) => ({
    ...layer,
    id: `context-${layer.id}`,
    ...(layer.type === 'symbol' ? { maxzoom: DETAIL_MIN_ZOOM } : {}),
  }));

/**
 * Full-detail layers, hidden below the handoff so they can't fight context.
 *
 * The generated set opens with an opaque `background` layer. Keeping it here
 * would paint over the context map everywhere the detail extract has no data,
 * so only the context set contributes a background.
 */
const detailLayers = (): LayerSpecification[] =>
  layers(BASEMAP_SOURCE, flavor, { lang: 'en' })
    .filter((layer) => layer.type !== 'background')
    .map((layer) => ({
      ...layer,
      minzoom: Math.max(layer.minzoom ?? 0, DETAIL_MIN_ZOOM),
    }));

/**
 * Slots the hillshade above the landmass fill but below roads and labels, so
 * relief reads as terrain the map sits on rather than a wash over everything.
 * Protomaps orders its layers earth → landuse/water → roads → labels.
 */
const withHillshade = (base: LayerSpecification[]): LayerSpecification[] => {
  const firstRoad = base.findIndex((layer) => layer.id.startsWith('roads'));
  const insertAt = firstRoad === -1 ? base.length : firstRoad;

  return [...base.slice(0, insertAt), hillshadeLayer, ...base.slice(insertAt)];
};

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
      // Mapterhorn ships Terrarium-encoded tiles. MapLibre defaults to Mapbox
      // encoding, which decodes without error but yields wrong elevations.
      encoding: 'terrarium',
      tileSize: 512,
      attribution: ATTRIBUTION_TERRAIN,
    },
  },
  // Context underneath, detail (plus hillshade) on top.
  layers: [...contextLayers(), ...withHillshade(detailLayers())],
});
