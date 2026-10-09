import type { GridRect } from '../../../types/grid.js';

/*** Resolve finite inclusive world-rectangle bounds, optionally normalizing a directional rectangle. */
export function getWorldRectBounds(
  rect: GridRect,
  label: string,
  allowNegativeDimensions = false,
): {
  readonly bottom: number;
  readonly height: number;
  readonly right: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
} {
  if (
    ![rect.x, rect.y, rect.width, rect.height].every(Number.isFinite) ||
    (!allowNegativeDimensions && (rect.width < 0 || rect.height < 0))
  ) {
    throw new RangeError(`${label} geometry must be finite with nonnegative dimensions.`);
  }
  const horizontalEnd = rect.x + rect.width;
  const verticalEnd = rect.y + rect.height;
  const x = Math.min(rect.x, horizontalEnd);
  const y = Math.min(rect.y, verticalEnd);
  const right = Math.max(rect.x, horizontalEnd);
  const bottom = Math.max(rect.y, verticalEnd);
  const width = right - x;
  const height = bottom - y;
  if (![horizontalEnd, verticalEnd, x, y, right, bottom, width, height].every(Number.isFinite)) {
    throw new RangeError(`${label} geometry must have finite endpoints and dimensions.`);
  }
  return { x, y, right, bottom, width, height };
}
