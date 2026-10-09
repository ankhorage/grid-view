import type { GridRect } from '../../types/grid.js';
import type {
  GridInteractionRectItem,
  GridMarqueeSelectionOptions,
} from '../../types/interactions.js';

/*** Select input-order item IDs by normalized marquee containment or intersection. */
export function selectWorldRects<T extends GridInteractionRectItem>(
  items: readonly T[],
  marquee: GridRect,
  options: GridMarqueeSelectionOptions,
): readonly string[] {
  const normalizedMarquee = normalizeWorldRect(marquee, 'Marquee');
  return items
    .filter((item) => {
      const rect = normalizeWorldRect(item, `Item ${item.id}`);
      return (
        (options.includeDisabled === true || !item.disabled) &&
        (options.mode === 'contain'
          ? containsWorldRect(normalizedMarquee, rect)
          : intersectsWorldRect(normalizedMarquee, rect))
      );
    })
    .map((item) => item.id);
}

/*** Normalize drag-direction rectangles into inclusive world-space boundaries. */
function normalizeWorldRect(rect: GridRect, label: string): GridRect {
  if (![rect.x, rect.y, rect.width, rect.height].every(Number.isFinite)) {
    throw new RangeError(`${label} geometry must be finite.`);
  }
  return {
    x: Math.min(rect.x, rect.x + rect.width),
    y: Math.min(rect.y, rect.y + rect.height),
    width: Math.abs(rect.width),
    height: Math.abs(rect.height),
  };
}

/*** Check whether all four boundaries of one normalized rectangle lie within another. */
function containsWorldRect(container: GridRect, rect: GridRect): boolean {
  return (
    rect.x >= container.x &&
    rect.y >= container.y &&
    rect.x + rect.width <= container.x + container.width &&
    rect.y + rect.height <= container.y + container.height
  );
}

/*** Check inclusive world-rectangle overlap so boundary touches remain selectable. */
function intersectsWorldRect(first: GridRect, second: GridRect): boolean {
  return (
    first.x <= second.x + second.width &&
    first.x + first.width >= second.x &&
    first.y <= second.y + second.height &&
    first.y + first.height >= second.y
  );
}
