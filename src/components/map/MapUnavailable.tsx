interface MapUnavailableProps {
  title: string;
  detail: string;
}

// Fallback shown in place of the map when it can't render.
const MapUnavailable = ({ title, detail }: MapUnavailableProps) => {
  return (
    <div
      role="alert"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '2rem',
        textAlign: 'center',
        background: 'var(--bg)',
      }}
    >
      <strong style={{ fontSize: '0.9375rem' }}>{title}</strong>
      <p style={{ margin: 0, maxWidth: '32rem', fontSize: '0.8125rem', opacity: 0.6 }}>
        {detail}
      </p>
    </div>
  );
};

export default MapUnavailable;
