import type {
  GridAxisMetrics,
  GridMatrixCell,
  GridMatrixCellPlacement,
} from '../../../types/layout.js';
import { readGridAxisMetric } from './readGridAxisMetric.js';

/*** Resolve a sparse cell after its row and column metrics have been indexed. */
export function resolveMatrixCellPlacement(
  cell: GridMatrixCell,
  rows: GridAxisMetrics,
  columns: GridAxisMetrics,
): GridMatrixCellPlacement {
  if (!cell.id) {
    throw new RangeError('Matrix cells require a nonempty ID.');
  }
  const rowIndex = rows.indexes.get(cell.rowId);
  const columnIndex = columns.indexes.get(cell.columnId);
  if (rowIndex === undefined || columnIndex === undefined) {
    throw new RangeError('Matrix cells must reference an existing row and column.');
  }
  return {
    ...cell,
    rowIndex,
    columnIndex,
    x: readGridAxisMetric(columns.offsets, columnIndex),
    y: readGridAxisMetric(rows.offsets, rowIndex),
    width: readGridAxisMetric(columns.sizes, columnIndex),
    height: readGridAxisMetric(rows.sizes, rowIndex),
  };
}
