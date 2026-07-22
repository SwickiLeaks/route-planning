import MapView from '@/components/MapView';
import MapOverlay from '@/components/MapOverlay';
import RoutePanel from '@/components/RoutePanel';
import { useRoutes } from '@/hooks';

const Dashboard = () => {
  // Fetched once here and passed down; the map and the panel render the same
  // route list, so they should not each hold their own copy.
  const { data: routes, loading } = useRoutes();

  return (
    <main
      style={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        height: '100%',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          borderBottom: '1px solid var(--border)',
          background: 'var(--panel)',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1rem', letterSpacing: '0.04em' }}>
          Route Planning
        </h1>
        <p style={{ margin: '0 auto', fontSize: '0.8125rem', opacity: 0.6 }}>
          UH-60
        </p>
      </header>

      {/* The map fills this area; control panels float over it as overlays. */}
      <div style={{ position: 'relative', minHeight: 0 }}>
        <MapView routes={routes} />
        <MapOverlay anchor="top-left" width="15rem">
          <RoutePanel routes={routes} loading={loading} />
        </MapOverlay>
      </div>
    </main>
  );
};

export default Dashboard;
