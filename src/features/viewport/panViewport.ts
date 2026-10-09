import type { GridPoint, GridViewport, GridViewportConstraints } from '../../types/grid.js';
import { constrainViewport } from './constrainViewport.js';

/*** Pan by pixel displacement; dragging to the right reveals world coordinates to the left. */
export function panViewport(
  viewport: GridViewport,
  displacement: GridPoint,
  constraints?: GridViewportConstraints,
): GridViewport {
  if (![displacement.x, displacement.y].every(Number.isFinite)) {
    throw new RangeError('Pan displacement must be finite.');
  }
  return constrainViewport(
    {
      ...viewport,
      offsetX: viewport.offsetX - displacement.x / viewport.pixelsPerUnitX,
      offsetY: viewport.offsetY - displacement.y / viewport.pixelsPerUnitY,
    },
    constraints,
  );
}
