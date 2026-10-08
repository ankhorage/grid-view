import type { GridRect, GridViewport } from '../../types/grid.js';
import { viewportToWorld } from './viewportToWorld.js';

/*** Calculate the visible world rectangle, optionally expanded by pixel overscan. */
export function getVisibleWorldBounds(viewport: GridViewport, overscanPixels = 0): GridRect {
  if (!Number.isFinite(overscanPixels) || overscanPixels < 0) {
    throw new RangeError('Overscan must be a finite nonnegative number.');
  }
  const topLeft = viewportToWorld({ x: -overscanPixels, y: -overscanPixels }, viewport);
  const bottomRight = viewportToWorld(
    { x: viewport.width + overscanPixels, y: viewport.height + overscanPixels },
    viewport,
  );
  return { x: topLeft.x, y: topLeft.y, width: bottomRight.x - topLeft.x, height: bottomRight.y - topLeft.y };
}
