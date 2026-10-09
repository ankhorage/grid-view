import type { GridPoint } from '../../types/grid.js';
import type { GridInteractionRectItem, GridMoveOptions } from '../../types/interactions.js';

/*** Move eligible world rectangles by a finite world delta while retaining input order and IDs. */
export function moveWorldRects<T extends GridInteractionRectItem>(
  items: readonly T[],
  delta: GridPoint,
  options: GridMoveOptions = {},
): readonly T[] {
  if (![delta.x, delta.y].every(Number.isFinite)) {
    throw new RangeError('Move delta must be finite.');
  }
  return items.map((item) =>
    (options.includeDisabled || !item.disabled) && (options.includeLocked || !item.locked)
      ? { ...item, x: item.x + delta.x, y: item.y + delta.y }
      : item,
  );
}
