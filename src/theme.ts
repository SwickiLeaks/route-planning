import { createTheme } from '@mui/material/styles';

/**
 * Matches the tokens in index.css — the map chrome and MUI components should
 * read as one surface. System font stack on purpose: MUI's default references
 * Roboto from Google Fonts, and this app makes no runtime network calls.
 */
export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#0f1115', paper: '#161a20' },
    divider: '#262c36',
    text: { primary: '#e6e8eb' },
    primary: { main: '#4cc9f0' },
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
});
