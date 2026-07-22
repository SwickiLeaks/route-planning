import MapView from '@/components/MapView';
import ControlBar from '@/components/ControlBar';
import { useRoutes } from '@/hooks';

const Dashboard = () => {
  const { data: routes } = useRoutes();

  return (
    // The map owns the whole viewport; controls float over it as overlays.
    <main style={{ position: 'relative', height: '100%' }}>
      <MapView routes={routes} />
      <ControlBar />
    </main>
  );
};

export default Dashboard;
