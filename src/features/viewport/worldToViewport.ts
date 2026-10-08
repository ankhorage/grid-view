import type { GridPoint, GridViewport } from '../../types/grid.js';

/*** Transform stable world coordinates to screen pixels. */
export function worldToViewport(point: GridPoint, viewport: GridViewport): GridPoint {
  return {
    x: (point.x - viewport.offsetX) * viewport.pixelsPerUnitX,
    y: (point.y - viewport.offsetY) * viewport.pixelsPerUnitY,
  };
}
