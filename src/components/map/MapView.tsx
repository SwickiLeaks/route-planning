import { useEffect, useMemo, useRef, useState } from 'react';
import { Map } from 'react-map-gl/maplibre';
import type { ErrorEvent } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import 'maplibre-gl/dist/maplibre-gl.css';

import { INITIAL_VIEW, MAX_BOUNDS, buildMapStyle } from '@/map/style';
import { isWebGLAvailable } from '@/map/webgl';
import RouteLayers from '@/components/map/RouteLayers';
import RouteCalcOverlay from '@/components/map/RouteCalcOverlay';
import MapUnavailable from '@/components/map/MapUnavailable';
import type { Route } from '@/types/proto';
import type { RouteCalculation } from '@/calc/types';
import type { BuilderRoute } from '@/route/routeBuilderTypes';

let protocolRegistered = false;

// Registers the pmtiles:// protocol handler with MapLibre, once per module.
const registerPmtilesProtocol = () => {
  if (protocolRegistered) return;

  const protocol = new Protocol();
  maplibregl.addProtocol('pmtiles', protocol.tile);
  protocolRegistered = true;
};

interface MapViewProps {
  routes: Route[];
  activeRoute?: BuilderRoute | null;
  calc?: RouteCalculation | null;
  calculating?: boolean;
  onMapClick?: (lngLat: { lng: number; lat: number }) => void;
  placing?: boolean;
  onInteractionChange?: (interacting: boolean) => void;
}

// Renders the MapLibre map with route layers and the calc overlay.
const MapView = ({
  routes,
  activeRoute,
  calc,
  calculating = false,
  onMapClick,
  placing = false,
  onInteractionChange,
}: MapViewProps) => {
  const restoreTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (restoreTimer.current) clearTimeout(restoreTimer.current);
  }, []);
  const [ready, setReady] = useState(protocolRegistered);
  const [webglOk] = useState(isWebGLAvailable);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    registerPmtilesProtocol();
    setReady(true);
  }, []);

  const mapStyle = useMemo(() => buildMapStyle(), []);

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
    console.error('[map] load error:', event.error);
    setLoadError(event.error?.message ?? 'Unknown map error');
  };

  return (
    <>
      <Map
        initialViewState={{ ...INITIAL_VIEW }}
        mapStyle={mapStyle}
        maxBounds={MAX_BOUNDS}
        dragRotate={false}
        touchZoomRotate={false}
        onError={handleError}
        cursor={placing ? 'crosshair' : dragging ? 'grabbing' : 'grab'}
        onDragStart={() => setDragging(true)}
        onDragEnd={() => setDragging(false)}
        onClick={(e) => {
          // Only real map-canvas clicks count as background clicks. Clicks on a
          // marker/chip target their own DOM (which may even unmount mid-click,
          // so a closest('.maplibregl-marker') test is unreliable) — ignore them.
          if (!(e.originalEvent?.target instanceof HTMLCanvasElement)) return;
          onMapClick?.({ lng: e.lngLat.lng, lat: e.lngLat.lat });
        }}
        onMoveStart={(e) => {
          if (!e.originalEvent) return;
          if (restoreTimer.current) clearTimeout(restoreTimer.current);
          onInteractionChange?.(true);
        }}
        onMoveEnd={() => {
          if (restoreTimer.current) clearTimeout(restoreTimer.current);
          restoreTimer.current = setTimeout(() => onInteractionChange?.(false), 350);
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <RouteLayers routes={routes} />
        {activeRoute && calc && (
          <RouteCalcOverlay route={activeRoute} calc={calc} calculating={calculating} />
        )}
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
