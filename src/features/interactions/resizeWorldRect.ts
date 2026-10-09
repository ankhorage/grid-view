import type { GridPoint, GridRect } from '../../types/grid.js';
import type {
  GridInteractionRectItem,
  GridResizeHandle,
  GridResizeOptions,
} from '../../types/interactions.js';

/*** Resize an eligible world rectangle from one handle while preserving finite minimum dimensions. */
export function resizeWorldRect<T extends GridInteractionRectItem>(
  item: T,
  handle: GridResizeHandle,
  delta: GridPoint,
  options: GridResizeOptions = {},
): T {
  assertResizeInput(item, handle, delta, options);
  if (
    item.resizable === false ||
    (!options.includeDisabled && item.disabled) ||
    (!options.includeLocked && item.locked)
  ) {
    return item;
  }
  const minimumWidth = options.minimumWidth ?? 0;
  const minimumHeight = options.minimumHeight ?? 0;
  const horizontal = resizeAxis(
    item.x,
    item.width,
    delta.x,
    handle.includes('left'),
    handle.includes('right'),
    minimumWidth,
  );
  const vertical = resizeAxis(
    item.y,
    item.height,
    delta.y,
    handle.includes('top'),
    handle.includes('bottom'),
    minimumHeight,
  );
  return {
    ...item,
    x: horizontal.start,
    y: vertical.start,
    width: horizontal.size,
    height: vertical.size,
  };
}

/*** Resize a single world axis from its leading or trailing handle without permitting inversion. */
function resizeAxis(
  start: number,
  size: number,
  delta: number,
  leading: boolean,
  trailing: boolean,
  minimum: number,
): { readonly start: number; readonly size: number } {
  if (leading) {
    const nextSize = Math.max(minimum, size - delta);
    return { start: start + size - nextSize, size: nextSize };
  }
  if (trailing) {
    return { start, size: Math.max(minimum, size + delta) };
  }
  return { start, size };
}

/*** Validate protected-item policy and geometry before deriving a resized rectangle. */
function assertResizeInput(
  item: GridRect,
  handle: GridResizeHandle,
  delta: GridPoint,
  options: GridResizeOptions,
): void {
  if (
    ![item.x, item.y, item.width, item.height, delta.x, delta.y].every(Number.isFinite) ||
    item.width < 0 ||
    item.height < 0
  ) {
    throw new RangeError('Resize geometry must be finite with nonnegative dimensions.');
  }
  if (!isResizeHandle(handle)) {
    throw new RangeError('Resize handle is invalid.');
  }
  if (
    ![options.minimumWidth ?? 0, options.minimumHeight ?? 0].every(
      (value) => Number.isFinite(value) && value >= 0,
    )
  ) {
    throw new RangeError('Resize minimum dimensions must be finite and nonnegative.');
  }
}

/*** Identify handles that map to a physical world-rectangle edge. */
function isResizeHandle(value: string): value is GridResizeHandle {
  return [
    'top',
    'top-right',
    'right',
    'bottom-right',
    'bottom',
    'bottom-left',
    'left',
    'top-left',
  ].includes(value);
}
