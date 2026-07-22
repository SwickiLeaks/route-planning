import type { Route } from '@/types/proto';
import { routeColor } from '@/map/routes';

interface RoutePanelProps {
  routes: Route[];
  loading: boolean;
}

const RoutePanel = ({ routes, loading }: RoutePanelProps) => {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        // Translucent so the map reads through — the panel should feel like it
        // floats over the chart rather than covering it.
        background: 'var(--panel-overlay)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.45)',
      }}
    >
      <h2
        style={{
          margin: 0,
          padding: '0.625rem 0.75rem',
          fontSize: '0.6875rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          opacity: 0.5,
          borderBottom: '1px solid var(--border)',
        }}
      >
        Tours
      </h2>

      <div style={{ overflowY: 'auto', minHeight: 0, padding: '0 0.75rem' }}>
        {loading ? (
          <p style={{ fontSize: '0.8125rem', opacity: 0.5 }}>Loading…</p>
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {routes.map((route, index) => (
              <li
                key={route.id}
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  padding: '0.5rem 0',
                  borderTop: index === 0 ? 'none' : '1px solid var(--border)',
                }}
              >
                <span
                  aria-hidden
                  style={{
                    flex: '0 0 auto',
                    width: '3px',
                    borderRadius: '2px',
                    background: routeColor(index),
                  }}
                />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.8125rem' }}>{route.name}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>
                    {route.waypoints.length} wpt
                    {route.distanceNm != null && ` · ${route.distanceNm} nm`}
                    {route.durationMin != null && ` · ${route.durationMin} min`}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default RoutePanel;
