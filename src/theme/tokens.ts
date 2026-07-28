/**
 * Design tokens — the single source of truth for color.
 *
 * Everything themed reads from here: the MUI theme (src/theme/index.ts), the
 * CSS variables injected by CssBaseline, and the map styling (route colors,
 * hillshade tint). To try a different theme, edit this file and nothing else.
 *
 * Direction: Apache-style dark cockpit — a neutral near-black charcoal base (no
 * olive wash), high-contrast bone inks, with a refined tactical green as the
 * primary accent and amber / maroon / red as subtle brighter accents.
 */

/** Raw palette. */
export const colors = {
  black: '#0b0c0d',
  /** Neutral bone off-white. */
  white: '#e6e6e1',
  /** Primary tactical accent — muted avionics green. */
  accent: '#7fa270',
  /** Subtle warm accent — amber. */
  gold: '#d7a444',
  /** Subtle deep accent. */
  maroon: '#8c3f46',
  /** Alert / critical only. */
  red: '#d64a3f',
  /** Neutral tan secondary ink. */
  brown: '#a89f8a',
  /** Olive drab — muted secondary. */
  olive: '#6a6f4f',
} as const;

/** Derived surfaces — neutral charcoal off near-black (no color wash). */
export const surface = {
  /** App background. */
  bg: '#0d0e0f',
  /** Opaque panel (headers, docked chrome). */
  panel: '#16171a',
  /** Translucent panel floating over the map. */
  overlay: 'rgba(11, 12, 13, 0.9)',
  /** Hairlines and dividers. */
  border: '#2b2d31',
} as const;

/**
 * Map accents, in draw-priority order. The active route uses the green accent;
 * the warmer colors sit later as subtle differentiators.
 */
export const mapAccents = {
  routeColors: [colors.accent, colors.gold, colors.brown, colors.maroon],
  routeCasing: colors.black,
  labelHalo: colors.black,
  hillshadeShadow: '#000000',
  hillshadeHighlight: colors.brown,
  hillshadeAccent: '#17181b',
} as const;
