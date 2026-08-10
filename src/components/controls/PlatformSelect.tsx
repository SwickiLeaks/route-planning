import { useState } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FlightIcon from '@mui/icons-material/Flight';
import { colors, surface } from '@/theme/tokens';
import { MONO, MUTED } from '@/components/shared/hudStyle';

// Selectable flight platforms. Hard-coded for now; a later pass can source these
// from the backend and push the choice onto the mission's vehicle.
const PLATFORMS = ['Generic Aircraft', 'MH-60 CLN', 'MH-6M', 'CH-47G'] as const;

const DEFAULT_PLATFORM = 'MH-60 CLN';

// Platform picker for the control bar: choose the flying vehicle for the route.
const PlatformSelect = () => {
  const [platform, setPlatform] = useState<string>(DEFAULT_PLATFORM);

  return (
    <Select
      value={platform}
      onChange={(e) => setPlatform(e.target.value)}
      size="small"
      startAdornment={<FlightIcon sx={{ fontSize: 17, color: colors.accent, mr: 0.75, transform: 'rotate(45deg)' }} />}
      MenuProps={{
        slotProps: {
          paper: {
            sx: {
              bgcolor: surface.panel,
              border: `1px solid ${surface.border}`,
              backgroundImage: 'none',
              '& .MuiMenuItem-root': {
                fontFamily: MONO,
                fontSize: 13,
                color: colors.white,
                '&.Mui-selected': { bgcolor: `${colors.accent}1f` },
                '&.Mui-selected:hover': { bgcolor: `${colors.accent}2b` },
                '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
              },
            },
          },
        },
      }}
      sx={{
        flexShrink: 0,
        minWidth: 150,
        borderRadius: '10px',
        bgcolor: 'rgba(255,255,255,0.03)',
        color: colors.white,
        fontFamily: MONO,
        fontSize: 13.5,
        '& .MuiSelect-select': { py: 0.75, pl: 1.25, display: 'flex', alignItems: 'center' },
        '& .MuiSelect-icon': { color: MUTED },
        '& .MuiOutlinedInput-notchedOutline': { borderColor: surface.border },
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: surface.border },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.accent, borderWidth: '1px' },
      }}
    >
      {PLATFORMS.map((vehicle) => (
        <MenuItem key={vehicle} value={vehicle}>
          {vehicle}
        </MenuItem>
      ))}
    </Select>
  );
};

export default PlatformSelect;
