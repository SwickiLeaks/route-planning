import { createTheme } from '@mui/material/styles';
import { colors, surface } from '@/theme/tokens';

export { colors, surface, mapAccents } from '@/theme/tokens';

/**
 * Registers `maroon` as a first-class palette color so components can take
 * color="maroon" like any built-in. Add future custom accents the same way.
 */
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

/** Used only to derive light/dark/contrast variants for custom colors. */
const derive = createTheme({ palette: { mode: 'dark' } });

/**
 * Core theme: dark, warm, tactical. Bright palette entries are accents on
 * interactive elements, never surfaces. System font stack on purpose — the app
 * makes no runtime network calls, so no Google-hosted Roboto.
 */
export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: surface.bg, paper: surface.panel },
    divider: surface.border,
    text: {
      primary: colors.white,
      secondary: colors.brown,
    },
    primary: { main: colors.gold, contrastText: colors.black },
    secondary: { main: colors.brown, contrastText: colors.black },
    success: { main: colors.olive, contrastText: colors.black },
    warning: { main: colors.yellow, contrastText: colors.black },
    error: { main: colors.red, contrastText: colors.white },
    maroon: derive.palette.augmentColor({
      color: { main: colors.maroon, contrastText: colors.white },
      name: 'maroon',
    }),
  },
  // Sharp corners read tactical; roundness reads consumer.
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
    // Re-declare the CSS variables from tokens so non-MUI code (index.css
    // consumers like MapUnavailable) stays in sync with the theme.
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
    // Kill the elevation lightening gradient — panels should darken, not glow.
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    // Dense by default; a control bar is not a marketing page.
    MuiButton: { defaultProps: { size: 'small', disableElevation: true } },
    MuiIconButton: { defaultProps: { size: 'small' } },
    MuiTextField: { defaultProps: { size: 'small' } },
    MuiToggleButtonGroup: { defaultProps: { size: 'small' } },
    MuiChip: { defaultProps: { size: 'small' } },
    MuiSwitch: { defaultProps: { size: 'small' } },
  },
});
