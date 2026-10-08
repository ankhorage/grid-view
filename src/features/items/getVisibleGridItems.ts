import type { GridViewport } from '../../types/grid.js';
import type { GridRectItem } from '../../types/items.js';
import { getVisibleWorldBounds } from '../viewport/getVisibleWorldBounds.js';

/*** Cull offscreen rectangular items without materializing logical grid cells. */
export function getVisibleGridItems<T extends GridRectItem>(
  items: readonly T[],
  viewport: GridViewport,
  overscanPixels = 0,
): readonly T[] {
  const bounds = getVisibleWorldBounds(viewport, overscanPixels);
  return items.filter((item) =>
    item.x <= bounds.x + bounds.width
    && item.x + item.width >= bounds.x
    && item.y <= bounds.y + bounds.height
    && item.y + item.height >= bounds.y,
  );
}
