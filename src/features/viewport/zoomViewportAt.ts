import type {
  GridPoint,
  GridViewport,
  GridViewportConstraints,
  GridZoomLimits,
} from '../../types/grid.js';
import { constrainViewport } from './constrainViewport.js';
import { viewportToWorld } from './viewportToWorld.js';

/*** Zoom around a fixed pixel focal point without moving its underlying world coordinate. */
export function zoomViewportAt(
  viewport: GridViewport,
  focalPoint: GridPoint,
  nextScale: Pick<GridViewport, 'pixelsPerUnitX' | 'pixelsPerUnitY'>,
  limits: GridZoomLimits = {},
  constraints?: GridViewportConstraints,
): GridViewport {
  if (
    ![focalPoint.x, focalPoint.y, nextScale.pixelsPerUnitX, nextScale.pixelsPerUnitY].every(
      Number.isFinite,
    )
  ) {
    throw new RangeError('Focal points and scales must be finite.');
  }
  const focalWorld = viewportToWorld(focalPoint, viewport);
  const x = constrainScale(nextScale.pixelsPerUnitX, limits.minX, limits.maxX);
  const y = constrainScale(nextScale.pixelsPerUnitY, limits.minY, limits.maxY);
  return constrainViewport(
    {
      ...viewport,
      pixelsPerUnitX: x,
      pixelsPerUnitY: y,
      offsetX: focalWorld.x - focalPoint.x / x,
      offsetY: focalWorld.y - focalPoint.y / y,
    },
    constraints,
  );
}

/*** Apply one valid independent axis scale range. */
function constrainScale(scale: number, minimum?: number, maximum?: number): number {
  const min = minimum ?? Number.EPSILON;
  const max = maximum ?? Infinity;
  if (
    !Number.isFinite(min) ||
    min <= 0 ||
    (maximum !== undefined && (!Number.isFinite(max) || max <= 0 || min > max))
  ) {
    throw new RangeError('Zoom limits must be finite positive ranges.');
  }
  if (scale <= 0) {
    throw new RangeError('Viewport scales must be positive.');
  }
  return Math.max(min, Math.min(max, scale));
}
