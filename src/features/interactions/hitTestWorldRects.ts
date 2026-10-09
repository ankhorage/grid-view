import type { GridPoint } from '../../types/grid.js';
import type { GridInteractionRectItem } from '../../types/interactions.js';

/*** Return the first input-order world rectangle containing a finite point. */
export function hitTestWorldRects<T extends GridInteractionRectItem>(
  items: readonly T[],
  point: GridPoint,
  includeDisabled = false,
): T | undefined {
  assertFinitePoint(point, 'Hit-test point');
  return items.find(
    (item) =>
      (includeDisabled || !item.disabled) &&
      isValidWorldRect(item) &&
      point.x >= item.x &&
      point.x <= item.x + item.width &&
      point.y >= item.y &&
      point.y <= item.y + item.height,
  );
}

/*** Reject a point that cannot participate in deterministic world-space geometry. */
function assertFinitePoint(point: GridPoint, label: string): void {
  if (![point.x, point.y].every(Number.isFinite)) {
    throw new RangeError(`${label} must be finite.`);
  }
}

/*** Identify finite, nonnegative world rectangles before comparing their inclusive boundaries. */
function isValidWorldRect(item: GridInteractionRectItem): boolean {
  return (
    [item.x, item.y, item.width, item.height].every(Number.isFinite) &&
    item.width >= 0 &&
    item.height >= 0
  );
}
