import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { glassPane } from '@/components/shared/hudStyle';
import { colors } from '@/theme/tokens';
import { useRouteBuilder } from '@/route/RouteBuilderContext';
import RouteBar from '@/components/builder/RouteBar';
import WaypointEditor from '@/components/builder/WaypointEditor';
import { SIDE_PANELS } from '@/components/controls/sidePanelRegistry';

// A compact icon+label button that toggles a side panel below the bar.
const PanelButton = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactElement;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <Box
    onClick={onClick}
    role="button"
    aria-pressed={active}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
      px: 1,
      py: 0.75,
      borderRadius: '8px',
      cursor: 'pointer',
      userSelect: 'none',
      flexShrink: 0,
      color: active ? colors.accent : colors.white,
      border: `1px solid ${active ? colors.accent : 'transparent'}`,
      bgcolor: active ? `${colors.accent}1f` : 'transparent',
      transition: 'color 150ms, border-color 150ms, background-color 150ms',
      '&:hover': { bgcolor: active ? `${colors.accent}1f` : 'rgba(255,255,255,0.06)' },
    }}
  >
    {icon}
    <Box sx={{ fontSize: 12.5, fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>{label}</Box>
  </Box>
);

// Top control dock: persistent route entry bar plus panel-launcher buttons.
const ControlBar = ({ faded = false }: { faded?: boolean }) => {
  const { selectedWaypointId, selectWaypoint } = useRouteBuilder();
  const [active, setActive] = useState<string | null>(null);

  // Selecting a waypoint (chip or map marker) closes any tool panel; its editor shows instead.
  useEffect(() => {
    if (selectedWaypointId) setActive(null);
  }, [selectedWaypointId]);

  // Opening a tool panel clears the current selection so only one panel shows at a time.
  const openPanel = (id: string) => {
    selectWaypoint(null);
    setActive((cur) => (cur === id ? null : id));
  };

  const toolPanel = SIDE_PANELS.find((p) => p.id === active) ?? null;
  const editing = selectedWaypointId != null;

  const fade = {
    opacity: faded ? 0.12 : 1,
    pointerEvents: (faded ? 'none' : 'auto') as 'none' | 'auto',
    transition: `opacity ${faded ? 150 : 450}ms ease, transform ${faded ? 150 : 450}ms ease`,
  };

  return (
    <Box sx={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          left: '50%',
          width: 'min(1320px, calc(100vw - 24px))',
          ...fade,
          transform: `translateX(-50%) translateY(${faded ? -12 : 0}px)`,
        }}
      >
        <Box
          sx={{
            ...glassPane,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 0.75,
          }}
        >
          <RouteBar />
          <Box sx={{ width: '1px', alignSelf: 'stretch', bgcolor: 'rgba(255,255,255,0.1)', mx: 0.25 }} />
          {SIDE_PANELS.map((p) => (
            <PanelButton
              key={p.id}
              icon={p.icon}
              label={p.label}
              active={active === p.id}
              onClick={() => openPanel(p.id)}
            />
          ))}
        </Box>

        {(editing || toolPanel) && (
          <Box sx={{ ...glassPane, mt: 0.75, p: 1, maxHeight: 'calc(100vh - 140px)', overflowY: 'auto' }}>
            {editing ? <WaypointEditor /> : toolPanel?.content}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ControlBar;
