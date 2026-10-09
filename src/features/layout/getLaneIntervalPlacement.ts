import type { GridLane, GridLaneInterval, GridLaneIntervalPlacement } from '../../types/layout.js';
import { createGridAxisMetrics } from './createGridAxisMetrics.js';
import { resolveLaneIntervalPlacement } from './utils/resolveLaneIntervalPlacement.js';

/*** Resolve one lane interval into its deterministic world-space rectangle. */
export function getLaneIntervalPlacement(
  lanes: readonly GridLane[],
  interval: GridLaneInterval,
): GridLaneIntervalPlacement {
  const laneMetrics = createGridAxisMetrics(lanes.map(({ id, height }) => ({ id, size: height })));
  return resolveLaneIntervalPlacement(interval, laneMetrics);
}
