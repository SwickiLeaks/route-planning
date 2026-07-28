export const colors = {
  black: '#0a0a0b',
  white: '#e7e3d9', // warm off-white ink
  accent: '#e0953c', // night amber-orange accent
  gold: '#e8b84c', // yellow-amber, caution
  maroon: '#9a565c', // deep accent, rare
  red: '#df564d', // alert / critical only
  brown: '#9c9790', // secondary ink
  olive: '#82817b', // neutral secondary
} as const;

export const surface = {
  bg: '#0e0e0f', // app background
  panel: '#161618', // opaque panel
  overlay: 'rgba(11, 11, 12, 0.9)', // translucent panel over map
  border: '#2a2a2d', // hairlines and dividers
} as const;

export const mapAccents = {
  routeColors: [colors.accent, colors.gold, colors.brown, colors.maroon],
  routeCasing: colors.black,
  labelHalo: colors.black,
  hillshadeShadow: '#000000', // FROZEN terrain literal
  hillshadeHighlight: '#b0a184', // FROZEN terrain literal
  hillshadeAccent: '#191b12', // FROZEN terrain literal
} as const;
