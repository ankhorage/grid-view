import type {
  GridMatrixCell,
  GridMatrixCellPlacement,
  GridMatrixLayout,
} from '../../types/layout.js';
import { createGridAxisMetrics } from './createGridAxisMetrics.js';
import { resolveMatrixCellPlacement } from './utils/resolveMatrixCellPlacement.js';

/*** Resolve one sparse matrix cell into its deterministic world-space rectangle. */
export function getMatrixCellPlacement(
  layout: GridMatrixLayout,
  cell: GridMatrixCell,
): GridMatrixCellPlacement {
  const rows = createGridAxisMetrics(layout.rows);
  const columns = createGridAxisMetrics(layout.columns);
  return resolveMatrixCellPlacement(cell, rows, columns);
}
