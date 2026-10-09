import type { GridRect } from '../../types/grid.js';
import type {
  GridInteractionRectItem,
  GridMarqueeSelectionOptions,
} from '../../types/interactions.js';
import { getWorldRectBounds } from './utils/getWorldRectBounds.js';

/*** Select input-order item IDs by normalized marquee containment or intersection. */
export function selectWorldRects<T extends GridInteractionRectItem>(
  items: readonly T[],
  marquee: GridRect,
  options: GridMarqueeSelectionOptions,
): readonly string[] {
  const normalizedMarquee = getWorldRectBounds(marquee, 'Marquee', true);
  return items
    .filter((item) => {
      const rect = getWorldRectBounds(item, `Item ${item.id}`);
      return (
        (options.includeDisabled === true || !item.disabled) &&
        (options.mode === 'contain'
          ? containsWorldRect(normalizedMarquee, rect)
          : intersectsWorldRect(normalizedMarquee, rect))
      );
    })
    .map((item) => item.id);
}

/*** Check whether all four boundaries of one normalized rectangle lie within another. */
function containsWorldRect(
  container: ReturnType<typeof getWorldRectBounds>,
  rect: ReturnType<typeof getWorldRectBounds>,
): boolean {
  return (
    rect.x >= container.x &&
    rect.y >= container.y &&
    rect.right <= container.right &&
    rect.bottom <= container.bottom
  );
}

/*** Check inclusive world-rectangle overlap so boundary touches remain selectable. */
function intersectsWorldRect(
  first: ReturnType<typeof getWorldRectBounds>,
  second: ReturnType<typeof getWorldRectBounds>,
): boolean {
  return (
    first.x <= second.right &&
    first.right >= second.x &&
    first.y <= second.bottom &&
    first.bottom >= second.y
  );
}
