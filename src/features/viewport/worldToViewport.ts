import type { GridPoint, GridViewport } from '../../types/grid.js';
import { assertValidViewport } from './assertValidViewport.js';

/*** Transform stable world coordinates to screen pixels. */
export function worldToViewport(point: GridPoint, viewport: GridViewport): GridPoint {
  assertValidViewport(viewport);
  if (![point.x, point.y].every(Number.isFinite)) {
    throw new RangeError('World points must be finite.');
  }
  return {
    x: (point.x - viewport.offsetX) * viewport.pixelsPerUnitX,
    y: (point.y - viewport.offsetY) * viewport.pixelsPerUnitY,
  };
}
