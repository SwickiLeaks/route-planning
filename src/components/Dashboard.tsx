import { useMemo, useState } from "react";
import { useMsnHandshake } from "@/api/hooks";
import ControlBar from "@/components/controls/ControlBar";
import MapView from "@/components/map/MapView";
import RouteHud from "@/components/hud/RouteHud";
import { useRoutes } from "@/hooks";
import { useRouteCalculation } from "@/calc/useRouteCalculation";
import {
  RouteBuilderProvider,
  useRouteBuilder,
} from "@/route/RouteBuilderContext";
import type { BuilderRoute } from "@/route/routeBuilderTypes";
import { RouteTabularProvider } from "@/route/RouteTabularContext";

// Reads the editable route and drives the map and HUD off it.
const DashboardContent = () => {
  const { route, selectWaypoint, placing, addWaypoint } = useRouteBuilder();
  const calc = useRouteCalculation(route);
  const [mapInteracting, setMapInteracting] = useState(false);

  return (
    <main style={{ position: "relative", height: "100%" }}>
      <MapView
        routes={[route]}
        activeRoute={route}
        calc={calc.data}
        calculating={calc.isCalculating}
        placing={placing}
        onMapClick={(lngLat) =>
          placing ? addWaypoint(lngLat) : selectWaypoint(null)
        }
        onInteractionChange={setMapInteracting}
      />
      <ControlBar faded={mapInteracting} />
      {calc.data && (
        <RouteHud
          route={route}
          calc={calc.data}
          calculating={calc.isCalculating}
          faded={mapInteracting}
        />
      )}
    </main>
  );
};

// Top-level dashboard: seeds the editable route and mounts the builder.
const Dashboard = () => {
  const { data: routes } = useRoutes();
  const handshakeResult = useMsnHandshake();
  console.log(handshakeResult.data);

  // Create the demo's mission + route on startup (see samples.java flow).
  // useMissionSession();

  // Start with an empty route; the user builds it by entering airport codes.
  const seed = useMemo<BuilderRoute>(() => {
    const first = routes[0];
    return {
      id: first?.id ?? "route",
      name: first?.name ?? "New Route",
      waypoints: [],
    };
  }, [routes]);

  return (
    <RouteBuilderProvider initialRoute={seed}>
      <RouteTabularProvider>
        <DashboardContent />
      </RouteTabularProvider>
    </RouteBuilderProvider>
  );
};

export default Dashboard;
