import type { GridPoint, GridViewport, GridZoomLimits } from '../../types/grid.js';
import { viewportToWorld } from './viewportToWorld.js';

/*** Zoom around a fixed pixel focal point without moving its underlying world coordinate. */
export function zoomViewportAt(
  viewport: GridViewport,
  focalPoint: GridPoint,
  nextScale: Pick<GridViewport, 'pixelsPerUnitX' | 'pixelsPerUnitY'>,
  limits: GridZoomLimits = {},
): GridViewport {
  if (nextScale.pixelsPerUnitX <= 0 || nextScale.pixelsPerUnitY <= 0) {
    throw new RangeError('Viewport scales must be positive.');
  }
  const focalWorld = viewportToWorld(focalPoint, viewport);
  const x = Math.max(
    limits.minX ?? Number.EPSILON,
    Math.min(limits.maxX ?? Infinity, nextScale.pixelsPerUnitX),
  );
  const y = Math.max(
    limits.minY ?? Number.EPSILON,
    Math.min(limits.maxY ?? Infinity, nextScale.pixelsPerUnitY),
  );
  return {
    ...viewport,
    pixelsPerUnitX: x,
    pixelsPerUnitY: y,
    offsetX: focalWorld.x - focalPoint.x / x,
    offsetY: focalWorld.y - focalPoint.y / y,
  };
}
