import type { GridAxisMetrics, GridMatrixAxisEntry } from '../../types/layout.js';

/*** Build validated lookup and cumulative world geometry for one ordered layout axis. */
export function createGridAxisMetrics(entries: readonly GridMatrixAxisEntry[]): GridAxisMetrics {
  const indexes = new Map<string, number>();
  const offsets: number[] = [];
  const sizes: number[] = [];
  let offset = 0;

  entries.forEach((entry, index) => {
    if (!entry.id || indexes.has(entry.id)) {
      throw new RangeError('Layout axis entries require unique nonempty IDs.');
    }
    if (!Number.isFinite(entry.size) || entry.size <= 0) {
      throw new RangeError('Layout axis entry sizes must be finite positive numbers.');
    }
    const end = offset + entry.size;
    if (!Number.isFinite(end)) {
      throw new RangeError('Layout axis cumulative world coordinates must be finite.');
    }
    indexes.set(entry.id, index);
    offsets.push(offset);
    sizes.push(entry.size);
    offset = end;
  });

  return { indexes, offsets, sizes };
}
