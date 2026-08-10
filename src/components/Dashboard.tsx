import { useMemo, useState } from "react";
import { MissionSessionProvider, useMsnHandshake } from "@/api/hooks";
import ControlBar from "@/components/controls/ControlBar";
import { PanelProvider } from "@/components/controls/PanelContext";
import MapView from "@/components/map/MapView";
import MapDimmer from "@/components/map/MapDimmer";
import { MapSettingsProvider } from "@/components/map/MapSettingsContext";
import RouteHud from "@/components/hud/RouteHud";
import { useRoutes } from "@/hooks";
import { useRouteCalculation } from "@/calc/useRouteCalculation";
import { RouteBuilderProvider, useRouteBuilder } from "@/route/RouteBuilderContext";
import { RouteCalcProvider, useRouteCalc } from "@/route/RouteCalcContext";
import { RouteTabularProvider } from "@/route/RouteTabularContext";
import type { BuilderRoute } from "@/route/routeBuilderTypes";

// Reads the editable route and drives the map and HUD off it.
const DashboardContent = () => {
  const { route, selectWaypoint, placing, addWaypoint } = useRouteBuilder();
  const calc = useRouteCalculation(route);
  const routeCalc = useRouteCalc();
  const [mapInteracting, setMapInteracting] = useState(false);
  const calculating = routeCalc.status === "calculating";

  return (
    <PanelProvider>
      <MapSettingsProvider>
        <main style={{ position: "relative", height: "100%" }}>
          <MapView
            routes={[route]}
            activeRoute={route}
            calc={calc.data}
            calculating={calculating}
            placing={placing}
            onMapClick={(lngLat) =>
              placing ? addWaypoint(lngLat) : selectWaypoint(null)
            }
            onInteractionChange={setMapInteracting}
          />
          <MapDimmer />
          <ControlBar faded={mapInteracting} />
          {calc.data && (
            <RouteHud
              route={route}
              calc={calc.data}
              calculating={calculating}
              faded={mapInteracting}
            />
          )}
        </main>
      </MapSettingsProvider>
    </PanelProvider>
  );
};

// Top-level dashboard: seeds the editable route and mounts the builder.
const Dashboard = () => {
  const { data: routes } = useRoutes();
  useMsnHandshake();

  // Start with an empty route; the user builds it by entering airport codes.
  const seed = useMemo<BuilderRoute>(() => {
    const first = routes[0];
    return { id: first?.id ?? 'route', name: first?.name ?? 'New Route', waypoints: [] };
  }, [routes]);

  // MsnSvr session (mission + route) wraps the builder so waypoint adds can
  // mirror to the backend and record their assigned point GUIDs.
  return (
    <MissionSessionProvider>
      <RouteBuilderProvider initialRoute={seed}>
        <RouteCalcProvider>
          <RouteTabularProvider>
            <DashboardContent />
          </RouteTabularProvider>
        </RouteCalcProvider>
      </RouteBuilderProvider>
    </MissionSessionProvider>
  );
};

export default Dashboard;
