import type { ReactElement } from 'react';
import Box from '@mui/material/Box';
import { colors } from '@/theme/tokens';
import { glassPane } from '@/components/shared/hudStyle';

interface ControlTileProps {
  icon: ReactElement;
  label: string;
  active: boolean;
  onClick: () => void;
}

// A glass launcher tile matching the bottom HUD tiles.
const ControlTile = ({ icon, label, active, onClick }: ControlTileProps) => (
  <Box
    onClick={onClick}
    role="button"
    aria-pressed={active}
    sx={{
      ...glassPane,
      display: 'flex',
      alignItems: 'center',
      gap: 0.75,
      px: 1.5,
      py: 1,
      cursor: 'pointer',
      userSelect: 'none',
      color: active ? colors.accent : colors.white,
      border: active ? `1px solid ${colors.accent}` : glassPane.border,
      bgcolor: active ? `${colors.accent}1f` : glassPane.bgcolor,
      transition: 'border-color 150ms, background-color 150ms, color 150ms',
      '&:hover': { borderColor: active ? colors.accent : `${colors.accent}88` },
    }}
  >
    {icon}
    <Box sx={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '0.01em' }}>{label}</Box>
  </Box>
);

export default ControlTile;
