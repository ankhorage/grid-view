import type {
  GridViewport,
  GridViewportAlignment,
  GridViewportConstraints,
} from '../../types/grid.js';
import { assertValidViewport } from './assertValidViewport.js';

/*** Constrain a viewport to finite world bounds while preserving valid unconstrained viewports. */
export function constrainViewport(
  viewport: GridViewport,
  constraints?: GridViewportConstraints,
): GridViewport {
  assertValidViewport(viewport);
  if (!constraints) {
    return viewport;
  }
  validateConstraints(constraints);
  return {
    ...viewport,
    offsetX: constrainAxis(
      viewport.offsetX,
      viewport.width / viewport.pixelsPerUnitX,
      constraints.world.x,
      constraints.world.width,
      constraints.overscrollX ?? 0,
      constraints.alignmentX ?? 'center',
    ),
    offsetY: constrainAxis(
      viewport.offsetY,
      viewport.height / viewport.pixelsPerUnitY,
      constraints.world.y,
      constraints.world.height,
      constraints.overscrollY ?? 0,
      constraints.alignmentY ?? 'center',
    ),
  };
}

/*** Constrain one world axis, aligning undersized bounded content deterministically. */
function constrainAxis(
  offset: number,
  visibleSize: number,
  worldStart: number,
  worldSize: number,
  overscroll: number,
  alignment: GridViewportAlignment,
): number {
  const minimum = worldStart - overscroll;
  const maximum = worldStart + worldSize - visibleSize + overscroll;
  if (minimum <= maximum) {
    return Math.max(minimum, Math.min(maximum, offset));
  }
  return worldStart - (visibleSize - worldSize) * getAlignmentFactor(alignment);
}

/*** Convert an alignment name to its dimensionless leading-edge factor. */
function getAlignmentFactor(alignment: GridViewportAlignment): number {
  return alignment === 'start' ? 0 : alignment === 'end' ? 1 : 0.5;
}

/*** Validate serializable viewport bounds before they affect interaction geometry. */
function validateConstraints(constraints: GridViewportConstraints): void {
  const { world } = constraints;
  if (
    ![world.x, world.y, world.width, world.height].every(Number.isFinite) ||
    world.width < 0 ||
    world.height < 0 ||
    ![constraints.overscrollX ?? 0, constraints.overscrollY ?? 0].every(
      (value) => Number.isFinite(value) && value >= 0,
    ) ||
    ![constraints.alignmentX, constraints.alignmentY].every(
      (value) => value === undefined || isAlignment(value),
    )
  ) {
    throw new RangeError(
      'Viewport constraints must contain finite world bounds and nonnegative overscroll.',
    );
  }
}

/*** Identify the finite set of supported undersized-world alignment values. */
function isAlignment(value: unknown): value is GridViewportAlignment {
  return value === 'start' || value === 'center' || value === 'end';
}
