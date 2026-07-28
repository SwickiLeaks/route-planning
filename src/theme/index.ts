import { createTheme } from '@mui/material/styles';
import { colors, surface } from '@/theme/tokens';

export { colors, surface, mapAccents } from '@/theme/tokens';

declare module '@mui/material/styles' {
  interface Palette {
    maroon: Palette['primary'];
  }
  interface PaletteOptions {
    maroon?: PaletteOptions['primary'];
  }
}
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    maroon: true;
  }
}
declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    maroon: true;
  }
}

const derive = createTheme({ palette: { mode: 'dark' } });

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: surface.bg, paper: surface.panel },
    divider: surface.border,
    text: {
      primary: colors.white,
      secondary: colors.brown,
    },
    primary: { main: colors.accent, contrastText: colors.black },
    secondary: { main: colors.brown, contrastText: colors.black },
    success: { main: colors.olive, contrastText: colors.black },
    warning: { main: colors.gold, contrastText: colors.black },
    error: { main: colors.red, contrastText: colors.white },
    maroon: derive.palette.augmentColor({
      color: { main: colors.maroon, contrastText: colors.white },
      name: 'maroon',
    }),
  },
  shape: { borderRadius: 2 },
  typography: {
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    button: {
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--bg': surface.bg,
          '--panel': surface.panel,
          '--panel-overlay': surface.overlay,
          '--border': surface.border,
          '--fg': colors.white,
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiButton: { defaultProps: { size: 'small', disableElevation: true } },
    MuiIconButton: { defaultProps: { size: 'small' } },
    MuiTextField: { defaultProps: { size: 'small' } },
    MuiToggleButtonGroup: { defaultProps: { size: 'small' } },
    MuiChip: { defaultProps: { size: 'small' } },
    MuiSwitch: { defaultProps: { size: 'small' } },
  },
});
