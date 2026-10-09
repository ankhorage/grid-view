import type { GridAxisCategory, GridAxisCategoryTick, GridAxisName } from '../../types/axes.js';
import type { GridViewport } from '../../types/grid.js';
import { getVisibleWorldBounds } from '../viewport/getVisibleWorldBounds.js';

/*** Project variable-width category starts into visible-only major ruler tick candidates. */
export function getAxisCategoryTicks(
  viewport: GridViewport,
  axis: GridAxisName,
  categories: readonly GridAxisCategory[],
): readonly GridAxisCategoryTick[] {
  const bounds = getVisibleWorldBounds(viewport);
  const start = axis === 'x' ? bounds.x : bounds.y;
  const end = axis === 'x' ? bounds.x + bounds.width : bounds.y + bounds.height;
  return categories
    .map((category) => validateCategory(category))
    .filter((category) => category.start >= start && category.start <= end)
    .sort((left, right) => left.start - right.start || left.id.localeCompare(right.id))
    .map((category) => ({
      position: category.start,
      level: 'major' as const,
      categoryId: category.id,
    }));
}

/*** Validate one serializable category interval before it becomes ruler geometry. */
function validateCategory(category: GridAxisCategory): GridAxisCategory {
  if (
    !category.id ||
    !Number.isFinite(category.start) ||
    !Number.isFinite(category.size) ||
    category.size <= 0
  ) {
    throw new RangeError('Axis categories require an id and finite positive size.');
  }
  return category;
}
