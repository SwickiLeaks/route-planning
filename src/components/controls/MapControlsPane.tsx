import { useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Brightness6Icon from '@mui/icons-material/Brightness6';
import { colors } from '@/theme/tokens';
import { MUTED } from '@/components/shared/hudStyle';
import { useMapSettings } from '@/components/map/MapSettingsContext';

// Leftmost (least brightness) still leaves the map faintly visible.
const MAX_DIM = 0.8;

// A small uppercase section heading.
const SectionLabel = ({ children }: { children: ReactNode }) => (
  <Box sx={{ fontSize: 9.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: MUTED, mt: 0.25 }}>
    {children}
  </Box>
);

// A label + switch row for a layer toggle.
const ToggleRow = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Box sx={{ fontSize: 12.5, color: colors.white }}>{label}</Box>
    <Switch
      size="small"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      sx={{
        '& .MuiSwitch-switchBase.Mui-checked': { color: colors.accent },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: colors.accent },
      }}
    />
  </Box>
);

// Map display controls. Brightness drives the on-map dimmer; the rest are
// placeholders (visual only) for map settings to be wired up later.
const MapControlsPane = () => {
  const { dim, setDim } = useMapSettings();
  const brightness = Math.round((1 - dim / MAX_DIM) * 100);

  // Placeholder state — these toggle in the UI but aren't connected to the map yet.
  const [basemap, setBasemap] = useState('terrain');
  const [labels, setLabels] = useState(true);
  const [hillshade, setHillshade] = useState(true);
  const [airspace, setAirspace] = useState(false);
  const [grid, setGrid] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, width: 230, px: 0.5, py: 0.25 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Brightness6Icon sx={{ fontSize: 16, color: colors.accent }} />
        <Box sx={{ fontSize: 12, fontWeight: 600, color: colors.white }}>Map Brightness</Box>
      </Box>
      <Slider
        size="small"
        value={brightness}
        min={0}
        max={100}
        onChange={(_, v) => setDim((1 - (Array.isArray(v) ? v[0] : v) / 100) * MAX_DIM)}
        aria-label="Map brightness"
        sx={{ color: colors.accent, mx: '4px', width: 'auto' }}
      />

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
      <SectionLabel>Base map</SectionLabel>
      <ToggleButtonGroup
        exclusive
        fullWidth
        size="small"
        value={basemap}
        onChange={(_, v: string | null) => v && setBasemap(v)}
        sx={{
          '& .MuiToggleButton-root': {
            py: '3px',
            textTransform: 'none',
            fontSize: 11,
            color: MUTED,
            border: '1px solid rgba(255,255,255,0.12)',
          },
          '& .Mui-selected': {
            color: `${colors.accent} !important`,
            backgroundColor: `${colors.accent}1f !important`,
            borderColor: `${colors.accent}66 !important`,
          },
        }}
      >
        <ToggleButton value="terrain">Terrain</ToggleButton>
        <ToggleButton value="satellite">Satellite</ToggleButton>
        <ToggleButton value="streets">Streets</ToggleButton>
      </ToggleButtonGroup>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
      <SectionLabel>Layers</SectionLabel>
      <ToggleRow label="Labels" checked={labels} onChange={setLabels} />
      <ToggleRow label="Terrain shading" checked={hillshade} onChange={setHillshade} />
      <ToggleRow label="Airspace" checked={airspace} onChange={setAirspace} />
      <ToggleRow label="Coordinate grid" checked={grid} onChange={setGrid} />
    </Box>
  );
};

export default MapControlsPane;
