import { useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { colors } from '@/theme/tokens';
import { MUTED } from '@/components/shared/hudStyle';
import { useMapSettings } from '@/components/map/MapSettingsContext';

// Leftmost (least brightness) still leaves the map faintly visible.
const MAX_DIM = 0.8;

// One horizontal section: a small uppercase heading over its control.
const Section = ({ label, children }: { label: string; children: ReactNode }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, justifyContent: 'flex-start' }}>
    <Box sx={{ fontSize: 9.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: MUTED }}>
      {label}
    </Box>
    {children}
  </Box>
);

// A compact inline switch + label for a layer toggle.
const LayerToggle = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
    <Switch
      size="small"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      sx={{
        '& .MuiSwitch-switchBase.Mui-checked': { color: colors.accent },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: colors.accent },
      }}
    />
    <Box sx={{ fontSize: 12, color: colors.white }}>{label}</Box>
  </Box>
);

// Map display controls, laid out left-to-right to keep the panel short. Brightness
// drives the on-map dimmer; the rest are placeholders (visual only) for now.
const MapControlsPane = () => {
  const { dim, setDim } = useMapSettings();
  const brightness = Math.round((1 - dim / MAX_DIM) * 100);

  // Placeholder state — these respond in the UI but aren't connected to the map yet.
  const [basemap, setBasemap] = useState('vfr');
  const [labels, setLabels] = useState(true);
  const [hillshade, setHillshade] = useState(true);
  const [grid, setGrid] = useState(false);

  const divider = (
    <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
  );

  return (
    <Box sx={{ display: 'flex', alignItems: 'stretch', flexWrap: 'wrap', gap: 1.5, px: 0.5, py: 0.25 }}>
      <Section label="Brightness">
        <Slider
          size="small"
          value={brightness}
          min={0}
          max={100}
          onChange={(_, v) => setDim((1 - (Array.isArray(v) ? v[0] : v) / 100) * MAX_DIM)}
          aria-label="Map brightness"
          sx={{ color: colors.accent, width: 130, mx: '4px', alignSelf: 'center' }}
        />
      </Section>

      {divider}

      <Section label="Base map">
        <ToggleButtonGroup
          exclusive
          size="small"
          value={basemap}
          onChange={(_, v: string | null) => v && setBasemap(v)}
          sx={{
            '& .MuiToggleButton-root': {
              py: '3px',
              px: 1.25,
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
          <ToggleButton value="vfr">VFR</ToggleButton>
          <ToggleButton value="satellite">Satellite</ToggleButton>
          <ToggleButton value="streets">Streets</ToggleButton>
        </ToggleButtonGroup>
      </Section>

      {divider}

      <Section label="Layers">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LayerToggle label="Labels" checked={labels} onChange={setLabels} />
          <LayerToggle label="Terrain" checked={hillshade} onChange={setHillshade} />
          <LayerToggle label="Grid" checked={grid} onChange={setGrid} />
        </Box>
      </Section>
    </Box>
  );
};

export default MapControlsPane;
