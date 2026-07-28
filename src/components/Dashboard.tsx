import { useMemo, useState } from "react";
import { useMsnHandshake } from "@/api/hooks";
import ControlBar from "@/components/ControlBar";
import MapView from "@/components/MapView";
import RouteHud from "@/components/hud/RouteHud";
import { useRoutes } from "@/hooks";
import { useRouteCalculation } from "@/calc/useRouteCalculation";
import { RouteBuilderProvider, useRouteBuilder } from "@/route/RouteBuilderContext";
import type { BuilderRoute } from "@/route/routeBuilderTypes";

/** Reads the editable route and drives the map + HUD off it. */
const DashboardContent = () => {
  const { route, selectWaypoint } = useRouteBuilder();
  const calc = useRouteCalculation(route);
  // While the map is being flown, panes recede so it takes priority. Purely
  // visual — pane state is untouched, so in-progress work is never lost.
  const [mapInteracting, setMapInteracting] = useState(false);

  return (
    // The map owns the whole viewport; controls float over it as overlays.
    <main style={{ position: "relative", height: "100%" }}>
      <MapView
        routes={[route]}
        activeRoute={route}
        calc={calc.data}
        calculating={calc.isCalculating}
        onBackgroundClick={() => selectWaypoint(null)}
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

const Dashboard = () => {
  const { data: routes } = useRoutes();
  const handshakeResult = useMsnHandshake();
  console.log(handshakeResult.data);

  // Seed the editable route from the first sample route (with an actions slot).
  const seed = useMemo<BuilderRoute | null>(() => {
    const first = routes[0];
    if (!first) return null;
    return { ...first, waypoints: first.waypoints.map((w) => ({ ...w, actions: [] })) };
  }, [routes]);

  // Brief null render until the sample route resolves (a microtask).
  if (!seed) return null;

  return (
    <RouteBuilderProvider initialRoute={seed}>
      <DashboardContent />
    </RouteBuilderProvider>
  );
};

export default Dashboard;
