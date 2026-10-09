import type { GridPoint } from '../../types/grid.js';
import type {
  GridInteractionRectItem,
  GridResizeHandle,
  GridResizeOptions,
} from '../../types/interactions.js';
import { getWorldRectBounds } from './utils/getWorldRectBounds.js';

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
  const resized = {
    ...item,
    x: horizontal.start,
    y: vertical.start,
    width: horizontal.size,
    height: vertical.size,
  };
  getWorldRectBounds(resized, `Resized item ${item.id}`);
  return resized;
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
  const end = start + size;
  if (!Number.isFinite(end)) {
    throw new RangeError('Resize geometry must have finite endpoints.');
  }
  if (leading) {
    const nextSize = Math.max(minimum, size - delta);
    const nextStart = end - nextSize;
    if (![nextSize, nextStart].every(Number.isFinite)) {
      throw new RangeError('Resize geometry must have finite results.');
    }
    return { start: nextStart, size: nextSize };
  }
  if (trailing) {
    const nextSize = Math.max(minimum, size + delta);
    if (!Number.isFinite(nextSize)) {
      throw new RangeError('Resize geometry must have finite results.');
    }
    return { start, size: nextSize };
  }
  return { start, size };
}

/*** Validate protected-item policy and geometry before deriving a resized rectangle. */
function assertResizeInput(
  item: GridInteractionRectItem,
  handle: GridResizeHandle,
  delta: GridPoint,
  options: GridResizeOptions,
): void {
  getWorldRectBounds(item, `Item ${item.id}`);
  if (![delta.x, delta.y].every(Number.isFinite)) {
    throw new RangeError('Resize delta must be finite.');
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
