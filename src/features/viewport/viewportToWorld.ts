import type { GridPoint, GridViewport } from '../../types/grid.js';

/*** Transform a viewport pixel coordinate back into world space. */
export function viewportToWorld(point: GridPoint, viewport: GridViewport): GridPoint {
  if (viewport.pixelsPerUnitX <= 0 || viewport.pixelsPerUnitY <= 0) {
    throw new RangeError('Viewport scales must be positive.');
  }
  return {
    x: viewport.offsetX + point.x / viewport.pixelsPerUnitX,
    y: viewport.offsetY + point.y / viewport.pixelsPerUnitY,
  };
}
