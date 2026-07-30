import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import { useEffect, useMemo, useState } from "react";
import type { ErrorEvent } from "react-map-gl/maplibre";
import { Map } from "react-map-gl/maplibre";

import MapUnavailable from "@/components/MapUnavailable";
import RouteLayers from "@/components/RouteLayers";
import { INITIAL_VIEW, MAX_BOUNDS, buildMapStyle } from "@/map/style";
import { isWebGLAvailable } from "@/map/webgl";
import type { Route } from "@/types/proto";

/**
 * Teaches MapLibre to resolve `pmtiles://` URLs by range-requesting the local
 * archive. Registered once at module scope — re-registering throws, and React
 * 19 StrictMode double-invokes effects.
 */
let protocolRegistered = false;

const registerPmtilesProtocol = () => {
  if (protocolRegistered) return;

  const protocol = new Protocol();
  maplibregl.addProtocol("pmtiles", protocol.tile);
  protocolRegistered = true;
};

interface MapViewProps {
  routes: Route[];
}

const MapView = ({ routes }: MapViewProps) => {
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
    console.error("[map] load error:", event.error);
    setLoadError(event.error?.message ?? "Unknown map error");
  };

  return (
    <>
      <Map
        initialViewState={{ ...INITIAL_VIEW }}
        // attributionControl={false}
        mapStyle={mapStyle}
        maxBounds={MAX_BOUNDS}
        dragRotate={false}
        touchZoomRotate={false}
        onError={handleError}
        style={{ width: "100%", height: "100%" }}
      >
        <RouteLayers routes={routes} />
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
