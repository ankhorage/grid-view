import type { GridViewport } from '../../types/grid.js';
import type { GridLane, GridLaneInterval, GridLaneIntervalPlacement } from '../../types/layout.js';
import { getVisibleWorldBounds } from '../viewport/getVisibleWorldBounds.js';
import { createGridAxisMetrics } from './createGridAxisMetrics.js';
import { resolveLaneIntervalPlacement } from './utils/resolveLaneIntervalPlacement.js';

/*** Enumerate lane intervals intersecting both viewport axes in stable input order. */
export function getVisibleLaneIntervals(
  lanes: readonly GridLane[],
  intervals: readonly GridLaneInterval[],
  viewport: GridViewport,
  overscanPixels = 0,
): readonly GridLaneIntervalPlacement[] {
  const laneMetrics = createGridAxisMetrics(lanes.map(({ id, height }) => ({ id, size: height })));
  const bounds = getVisibleWorldBounds(viewport, overscanPixels);
  validateUniqueIds(intervals);
  return intervals.flatMap((interval) => {
    const placement = resolveLaneIntervalPlacement(interval, laneMetrics);
    return intersects(placement.x, placement.width, bounds.x, bounds.width) &&
      intersects(placement.y, placement.height, bounds.y, bounds.height)
      ? [placement]
      : [];
  });
}

/*** Reject ambiguous interval catalogues whose stable identities cannot be preserved. */
function validateUniqueIds(intervals: readonly GridLaneInterval[]): void {
  const ids = new Set<string>();
  intervals.forEach(({ id }) => {
    if (ids.has(id)) {
      throw new RangeError('Lane intervals require unique IDs.');
    }
    ids.add(id);
  });
}

/*** Determine whether two one-dimensional world intervals overlap or touch at their boundaries. */
function intersects(
  firstStart: number,
  firstExtent: number,
  secondStart: number,
  secondExtent: number,
): boolean {
  return firstStart <= secondStart + secondExtent && firstStart + firstExtent >= secondStart;
}
