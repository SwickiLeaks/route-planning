/**
 * MapLibre renders through WebGL. Headless or GPU-less environments (many
 * Linux VMs, some remote desktops) can't create a context, and MapLibre's own
 * failure there is an uncaught "Failed to initialize WebGL" that leaves a blank
 * map with no explanation. Preflight so we can show a real message instead.
 */
export const isWebGLAvailable = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    // MapLibre v5 needs WebGL2, falling back to WebGL1.
    const gl =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl');
    return gl != null;
  } catch {
    // Some browsers throw rather than returning null when GL is disabled.
    return false;
  }
};
