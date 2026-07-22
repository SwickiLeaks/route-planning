import type { CSSProperties, ReactNode } from 'react';

/**
 * Anchors a floating panel over the map.
 *
 * Each overlay is its own absolutely-positioned box, so the map still receives
 * pointer events everywhere the box isn't — no full-size `pointer-events: none`
 * wrapper needed. Panels stay inside the map container's padding and scroll
 * internally rather than growing past the viewport.
 *
 * Must be rendered inside a `position: relative` container.
 */
const ANCHORS = {
  'top-left': { top: 0, left: 0 },
  'top-right': { top: 0, right: 0 },
  'bottom-left': { bottom: 0, left: 0 },
  'bottom-right': { bottom: 0, right: 0 },
} as const;

export type OverlayAnchor = keyof typeof ANCHORS;

interface MapOverlayProps {
  anchor?: OverlayAnchor;
  /** Panel width; omit to size to content. */
  width?: CSSProperties['width'];
  children: ReactNode;
}

const GUTTER = '0.75rem';

const MapOverlay = ({
  anchor = 'top-left',
  width,
  children,
}: MapOverlayProps) => {
  return (
    <div
      style={{
        position: 'absolute',
        ...ANCHORS[anchor],
        margin: GUTTER,
        width,
        // Leave the gutter on both sides so a tall panel can't run off-screen.
        maxHeight: `calc(100% - 2 * ${GUTTER})`,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        zIndex: 1,
      }}
    >
      {children}
    </div>
  );
};

export default MapOverlay;
