import type { GridRect } from './grid.js';

/** An item whose hit/culling geometry is represented in world units. */
export interface GridRectItem extends GridRect {
  readonly id: string;
}
