import type { GridViewport } from '../../types/grid.js';
import type {
  GridMatrixCell,
  GridMatrixCellPlacement,
  GridMatrixLayout,
} from '../../types/layout.js';
import { getVisibleWorldBounds } from '../viewport/getVisibleWorldBounds.js';
import { createGridAxisMetrics } from './createGridAxisMetrics.js';
import { readGridAxisMetric } from './utils/readGridAxisMetric.js';
import { resolveMatrixCellPlacement } from './utils/resolveMatrixCellPlacement.js';

/*** Enumerate only sparse matrix cells intersecting the viewport in stable input order. */
export function getVisibleMatrixCells(
  layout: GridMatrixLayout,
  cells: readonly GridMatrixCell[],
  viewport: GridViewport,
  overscanPixels = 0,
): readonly GridMatrixCellPlacement[] {
  const rows = createGridAxisMetrics(layout.rows);
  const columns = createGridAxisMetrics(layout.columns);
  validateUniqueIds(cells, 'Matrix cells');
  const bounds = getVisibleWorldBounds(viewport, overscanPixels);
  const rowRange = getIntersectingRange(rows.offsets, rows.sizes, bounds.y, bounds.height);
  const columnRange = getIntersectingRange(columns.offsets, columns.sizes, bounds.x, bounds.width);
  if (rowRange === undefined || columnRange === undefined) {
    return [];
  }

  return cells.flatMap((cell) => {
    const placement = resolveMatrixCellPlacement(cell, rows, columns);
    return placement.rowIndex >= rowRange.start &&
      placement.rowIndex <= rowRange.end &&
      placement.columnIndex >= columnRange.start &&
      placement.columnIndex <= columnRange.end
      ? [placement]
      : [];
  });
}

/*** Reject ambiguous sparse catalogues whose stable identities cannot be preserved. */
function validateUniqueIds(cells: readonly GridMatrixCell[], label: string): void {
  const ids = new Set<string>();
  cells.forEach(({ id }) => {
    if (ids.has(id)) {
      throw new RangeError(`${label} require unique IDs.`);
    }
    ids.add(id);
  });
}

/*** Find the inclusive axis-index interval whose entries intersect a world-space window. */
function getIntersectingRange(
  offsets: readonly number[],
  sizes: readonly number[],
  start: number,
  extent: number,
): { readonly start: number; readonly end: number } | undefined {
  const end = start + extent;
  const first = findFirstEndingAtOrAfter(offsets, sizes, start);
  const last = findLastStartingAtOrBefore(offsets, end);
  return first === undefined || last === undefined || first > last
    ? undefined
    : { start: first, end: last };
}

/*** Find the first entry whose trailing edge reaches a world coordinate. */
function findFirstEndingAtOrAfter(
  offsets: readonly number[],
  sizes: readonly number[],
  coordinate: number,
): number | undefined {
  let low = 0;
  let high = offsets.length - 1;
  let result: number | undefined;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    if (readGridAxisMetric(offsets, middle) + readGridAxisMetric(sizes, middle) >= coordinate) {
      result = middle;
      high = middle - 1;
    } else {
      low = middle + 1;
    }
  }
  return result;
}

/*** Find the final entry whose leading edge does not exceed a world coordinate. */
function findLastStartingAtOrBefore(
  offsets: readonly number[],
  coordinate: number,
): number | undefined {
  let low = 0;
  let high = offsets.length - 1;
  let result: number | undefined;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    if (readGridAxisMetric(offsets, middle) <= coordinate) {
      result = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }
  return result;
}
