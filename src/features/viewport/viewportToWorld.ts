import type { GridPoint, GridViewport } from '../../types/grid.js';
import { assertValidViewport } from './assertValidViewport.js';

/*** Transform a viewport pixel coordinate back into world space. */
export function viewportToWorld(point: GridPoint, viewport: GridViewport): GridPoint {
  assertValidViewport(viewport);
  if (![point.x, point.y].every(Number.isFinite)) {
    throw new RangeError('Viewport points must be finite.');
  }
  return {
    x: viewport.offsetX + point.x / viewport.pixelsPerUnitX,
    y: viewport.offsetY + point.y / viewport.pixelsPerUnitY,
  };
}
