import ControlBar from "@/components/ControlBar";
import MapView from "@/components/MapView";
import { useRoutes } from "@/hooks";
import { useHandshake } from "../api/hooks/useHandshake";

const Dashboard = () => {
  const { data: routes } = useRoutes();
  const handshakeResult = useHandshake();

  console.log(handshakeResult.data);

  return (
    // The map owns the whole viewport; controls float over it as overlays.
    <main style={{ position: "relative", height: "100%" }}>
      <MapView routes={routes} />
      <ControlBar />
    </main>
  );
};

export default Dashboard;
