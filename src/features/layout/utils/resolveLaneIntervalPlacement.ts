import type {
  GridAxisMetrics,
  GridLaneInterval,
  GridLaneIntervalPlacement,
} from '../../../types/layout.js';
import { readGridAxisMetric } from './readGridAxisMetric.js';

/*** Resolve an interval after its ordered lane metrics have been indexed. */
export function resolveLaneIntervalPlacement(
  interval: GridLaneInterval,
  lanes: GridAxisMetrics,
): GridLaneIntervalPlacement {
  if (
    !interval.id ||
    !Number.isFinite(interval.start) ||
    !Number.isFinite(interval.extent) ||
    interval.extent <= 0
  ) {
    throw new RangeError('Lane intervals require an ID, finite start, and positive extent.');
  }
  if (!Number.isFinite(interval.start + interval.extent)) {
    throw new RangeError('Lane interval end coordinates must be finite.');
  }
  const laneIndex = lanes.indexes.get(interval.laneId);
  if (laneIndex === undefined) {
    throw new RangeError('Lane intervals must reference an existing lane.');
  }
  return {
    ...interval,
    laneIndex,
    x: interval.start,
    y: readGridAxisMetric(lanes.offsets, laneIndex),
    width: interval.extent,
    height: readGridAxisMetric(lanes.sizes, laneIndex),
  };
}
