import type { GridRect, GridViewport } from '../../types/grid.js';

/***
 * Minimally pans a viewport so that a world rectangle is visible inside pixel padding.
 * Oversized rectangles align their leading edges because neither axis can show them in full.
 */
export function revealWorldRect(
  viewport: GridViewport,
  rect: GridRect,
  paddingPixels = 0,
): GridViewport {
  validateRevealInput(viewport, rect, paddingPixels);
  return {
    ...viewport,
    offsetX: revealAxis(
      viewport.offsetX,
      viewport.width,
      viewport.pixelsPerUnitX,
      rect.x,
      rect.width,
      paddingPixels,
    ),
    offsetY: revealAxis(
      viewport.offsetY,
      viewport.height,
      viewport.pixelsPerUnitY,
      rect.y,
      rect.height,
      paddingPixels,
    ),
  };
}

/*** Resolve the minimal world-coordinate offset that exposes one axis of a rectangle. */
function revealAxis(
  offset: number,
  viewportPixels: number,
  pixelsPerUnit: number,
  rectStart: number,
  rectSize: number,
  paddingPixels: number,
): number {
  const visibleStart = offset + paddingPixels / pixelsPerUnit;
  const visibleEnd = offset + (viewportPixels - paddingPixels) / pixelsPerUnit;
  const rectEnd = rectStart + rectSize;
  if (rectSize > visibleEnd - visibleStart || rectStart < visibleStart) {
    return rectStart - paddingPixels / pixelsPerUnit;
  }
  if (rectEnd > visibleEnd) {
    return rectEnd - (viewportPixels - paddingPixels) / pixelsPerUnit;
  }
  return offset;
}

/*** Reject geometry that cannot produce a meaningful visible viewport interior. */
function validateRevealInput(viewport: GridViewport, rect: GridRect, paddingPixels: number): void {
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
    viewport.pixelsPerUnitY <= 0 ||
    !Number.isFinite(paddingPixels) ||
    paddingPixels < 0 ||
    paddingPixels * 2 >= viewport.width ||
    paddingPixels * 2 >= viewport.height
  ) {
    throw new RangeError('Viewport geometry must be finite and padding must leave visible space.');
  }
  if (
    ![rect.x, rect.y, rect.width, rect.height].every(Number.isFinite) ||
    rect.width < 0 ||
    rect.height < 0
  ) {
    throw new RangeError('World rectangles must have finite nonnegative dimensions.');
  }
}
