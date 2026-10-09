import type { GridPoint } from '../../types/grid.js';
import type { GridInteractionRectItem } from '../../types/interactions.js';
import { getWorldRectBounds } from './utils/getWorldRectBounds.js';

/*** Return the first input-order world rectangle containing a finite point. */
export function hitTestWorldRects<T extends GridInteractionRectItem>(
  items: readonly T[],
  point: GridPoint,
  includeDisabled = false,
): T | undefined {
  assertFinitePoint(point, 'Hit-test point');
  return items
    .map((item) => ({ item, bounds: getWorldRectBounds(item, `Item ${item.id}`) }))
    .find(
      ({ item, bounds }) =>
        (includeDisabled || !item.disabled) &&
        point.x >= bounds.x &&
        point.x <= bounds.right &&
        point.y >= bounds.y &&
        point.y <= bounds.bottom,
    )?.item;
}

/*** Reject a point that cannot participate in deterministic world-space geometry. */
function assertFinitePoint(point: GridPoint, label: string): void {
  if (![point.x, point.y].every(Number.isFinite)) {
    throw new RangeError(`${label} must be finite.`);
  }
}
