/**
 * Design tokens — the single source of truth for color.
 *
 * Everything themed reads from here: the MUI theme (src/theme/index.ts), the
 * CSS variables injected by CssBaseline, and the map styling (route colors,
 * hillshade tint). To try a different theme, edit this file and nothing else.
 */

/** Raw palette. */
export const colors = {
  black: '#0d0d0d',
  white: '#faf9f7',
  yellow: '#fcde2a',
  gold: '#eeb60b',
  maroon: '#6f2b33',
  red: '#fa181f',
  brown: '#c0ad91',
  olive: '#818478',
} as const;

/** Derived surfaces — warm-tinted lifts off black rather than new hues. */
export const surface = {
  /** App background. */
  bg: colors.black,
  /** Opaque panel (headers, docked chrome). */
  panel: '#141412',
  /** Translucent panel floating over the map. */
  overlay: 'rgba(13, 13, 13, 0.85)',
  /** Hairlines and dividers. */
  border: '#2a2822',
} as const;

/**
 * Map accents, in draw-priority order. Bright, warm, distinct against both the
 * dark basemap and the hillshade.
 */
export const mapAccents = {
  routeColors: [colors.yellow, colors.maroon, colors.brown, colors.gold],
  routeCasing: colors.black,
  labelHalo: colors.black,
  hillshadeShadow: '#000000',
  hillshadeHighlight: colors.brown,
  hillshadeAccent: '#1f1d18',
} as const;
