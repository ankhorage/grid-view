import type { GridPoint, GridViewport } from '../../types/grid.js';

/*** Pan by pixel displacement; dragging to the right reveals world coordinates to the left. */
export function panViewport(viewport: GridViewport, displacement: GridPoint): GridViewport {
  if (viewport.pixelsPerUnitX <= 0 || viewport.pixelsPerUnitY <= 0) {
    throw new RangeError('Viewport scales must be positive.');
  }
  return {
    ...viewport,
    offsetX: viewport.offsetX - displacement.x / viewport.pixelsPerUnitX,
    offsetY: viewport.offsetY - displacement.y / viewport.pixelsPerUnitY,
  };
}
