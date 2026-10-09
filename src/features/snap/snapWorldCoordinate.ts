import type { GridSnapResolver, GridSnapSpecification } from '../../types/snap.js';

/*** Snap a world coordinate without consulting zoom or grid-line density. */
export function snapWorldCoordinate(
  value: number,
  specification: GridSnapSpecification,
  resolver?: GridSnapResolver,
): number {
  if (!Number.isFinite(value)) {
    throw new RangeError('World coordinate must be finite.');
  }
  if (resolver) {
    const result = resolver(value);
    if (!Number.isFinite(result)) {
      throw new RangeError('Custom snap resolver must return a finite coordinate.');
    }
    return result;
  }
  if (specification.mode === 'off') {
    return value;
  }
  if (!Number.isFinite(specification.step) || specification.step <= 0) {
    throw new RangeError('Snap step must be positive and finite.');
  }
  const origin = specification.origin ?? 0;
  if (!Number.isFinite(origin)) {
    throw new RangeError('Snap origin must be finite.');
  }
  const snapped = origin + Math.round((value - origin) / specification.step) * specification.step;
  if (!Number.isFinite(snapped)) {
    throw new RangeError('Snapped world coordinate must be finite.');
  }
  return snapped;
}
