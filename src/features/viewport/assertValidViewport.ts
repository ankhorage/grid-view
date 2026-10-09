import type { GridViewport } from '../../types/grid.js';

/*** Reject viewport geometry that would produce non-finite coordinate transforms. */
export function assertValidViewport(viewport: GridViewport): void {
  if (
    ![
      viewport.width,
      viewport.height,
      viewport.offsetX,
      viewport.offsetY,
      viewport.pixelsPerUnitX,
      viewport.pixelsPerUnitY,
    ].every(Number.isFinite) ||
    viewport.width <= 0 ||
    viewport.height <= 0 ||
    viewport.pixelsPerUnitX <= 0 ||
    viewport.pixelsPerUnitY <= 0
  ) {
    throw new RangeError('Viewport geometry must be finite with positive dimensions and scales.');
  }
}
