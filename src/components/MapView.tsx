import { useEffect, useMemo, useState } from 'react';
// NavigationControl / ScaleControl are also exported here if you re-enable them.
import { Map } from 'react-map-gl/maplibre';
import type { ErrorEvent } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import 'maplibre-gl/dist/maplibre-gl.css';

import { INITIAL_VIEW, MAX_BOUNDS, buildMapStyle } from '@/map/style';
import { isWebGLAvailable } from '@/map/webgl';
import RouteLayers from '@/components/RouteLayers';
import RouteCalcOverlay from '@/components/hud/RouteCalcOverlay';
import MapUnavailable from '@/components/MapUnavailable';
import type { Route } from '@/types/proto';
import type { RouteCalculation } from '@/calc/types';
import type { BuilderRoute } from '@/route/routeBuilderTypes';

/**
 * Teaches MapLibre to resolve `pmtiles://` URLs by range-requesting the local
 * archive. Registered once at module scope — re-registering throws, and React
 * 19 StrictMode double-invokes effects.
 */
let protocolRegistered = false;

const registerPmtilesProtocol = () => {
  if (protocolRegistered) return;

  const protocol = new Protocol();
  maplibregl.addProtocol('pmtiles', protocol.tile);
  protocolRegistered = true;
};

interface MapViewProps {
  routes: Route[];
  /** The route whose calc overlay is drawn on the map. */
  activeRoute?: BuilderRoute | null;
  calc?: RouteCalculation | null;
  /** True while a calc is in flight — dims the map readouts. */
  calculating?: boolean;
  /** Fired on a click that misses every marker — used to clear selection. */
  onBackgroundClick?: () => void;
}

const MapView = ({
  routes,
  activeRoute,
  calc,
  calculating = false,
  onBackgroundClick,
}: MapViewProps) => {
  // Gate the first render on registration so the style can't request a
  // pmtiles:// URL before the handler exists.
  const [ready, setReady] = useState(protocolRegistered);
  // Checked once on mount — WebGL support doesn't change within a session.
  const [webglOk] = useState(isWebGLAvailable);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    registerPmtilesProtocol();
    setReady(true);
  }, []);

  const mapStyle = useMemo(() => buildMapStyle(), []);

  // Most likely on a GPU-less VM or with WebGL disabled in the browser.
  if (!webglOk) {
    return (
      <MapUnavailable
        title="Map can't be displayed"
        detail="This browser can't initialize WebGL, which the map requires. If you're on a VM or remote desktop, enable GPU/WebGL in the browser, or open the app from a machine with graphics acceleration."
      />
    );
  }

  if (!ready) return null;

  const handleError = (event: ErrorEvent) => {
    // Surfaces style/tile/source failures that otherwise blank the map silently
    // — e.g. missing public/map/*.pmtiles because `npm run map:fetch` hasn't run.
    console.error('[map] load error:', event.error);
    setLoadError(event.error?.message ?? 'Unknown map error');
  };

  return (
    <>
      <Map
        initialViewState={{ ...INITIAL_VIEW }}
        // attributionControl={false}
        mapStyle={mapStyle}
        maxBounds={MAX_BOUNDS}
        // Tour planning is a top-down task; keep the camera 2D and predictable.
        dragRotate={false}
        touchZoomRotate={false}
        onError={handleError}
        onClick={() => onBackgroundClick?.()}
        style={{ width: '100%', height: '100%' }}
      >
        <RouteLayers routes={routes} />
        {activeRoute && calc && (
          <RouteCalcOverlay route={activeRoute} calc={calc} calculating={calculating} />
        )}
        {/* <NavigationControl position="top-right" showCompass={false} /> */}
        {/* <ScaleControl position="bottom-left" unit="nautical" /> */}
      </Map>

      {loadError && (
        <MapUnavailable
          title="Map data failed to load"
          detail={`${loadError}. If this is a fresh clone, run "npm run map:fetch" to download the map tiles into public/map/, then reload.`}
        />
      )}
    </>
  );
};

export default MapView;
