import ControlBar from "@/components/ControlBar";
import MapView from "@/components/MapView";
import { useRoutes } from "@/hooks";

const Dashboard = () => {
  const { data: routes } = useRoutes();

  return (
    <main style={{ position: "relative", height: "100%" }}>
      <MapView routes={routes} />
      <ControlBar />
    </main>
  );
};

export default Dashboard;
