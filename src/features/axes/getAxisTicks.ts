import type {
  GridAxisName, GridAxisTick, GridTickProvider, GridTickSpecification,
} from '../../types/axes.js';
import type { GridViewport } from '../../types/grid.js';
import { getVisibleWorldBounds } from '../viewport/getVisibleWorldBounds.js';

/*** Generate only visible ruler ticks; a domain adapter may supply irregular boundaries. */
export function getAxisTicks(
  viewport: GridViewport,
  axis: GridAxisName,
  specification: GridTickSpecification,
  provider?: GridTickProvider,
): readonly GridAxisTick[] {
  const bounds = getVisibleWorldBounds(viewport, specification.overscanPixels ?? 0);
  const start = axis === 'x' ? bounds.x : bounds.y;
  const end = axis === 'x' ? bounds.x + bounds.width : bounds.y + bounds.height;
  const pixelsPerUnit = axis === 'x' ? viewport.pixelsPerUnitX : viewport.pixelsPerUnitY;
  if (provider) {
    return provider({ viewport, axis, start, end, pixelsPerUnit })
      .filter((tick) => Number.isFinite(tick.position) && tick.position >= start && tick.position <= end)
      .sort((a, b) => a.position - b.position);
  }
  const step = specification.mode === 'fixed'
    ? specification.step
    : adaptiveStep((specification.minPixelSpacing ?? 32) / pixelsPerUnit);
  if (!Number.isFinite(step) || step <= 0) {
    throw new RangeError('Grid tick step must be positive and finite.');
  }
  const origin = specification.origin ?? 0;
  const first = Math.ceil((start - origin) / step);
  const last = Math.floor((end - origin) / step);
  const count = Math.max(0, last - first + 1);
  if (count > (specification.maxTicks ?? 2048)) {
    throw new RangeError('Too many visible ticks. Increase display spacing or use adaptive ticks.');
  }
  const majorEvery = specification.majorEvery ?? 1;
  if (!Number.isSafeInteger(majorEvery) || majorEvery < 1) {
    throw new RangeError('majorEvery must be a positive integer.');
  }
  return Array.from({ length: count }, (_, index) => {
    const tickIndex = first + index;
    return {
      position: origin + tickIndex * step,
      level: tickIndex % majorEvery === 0 ? 'major' as const : 'minor' as const,
    };
  });
}

function adaptiveStep(minimum: number): number {
  if (!Number.isFinite(minimum) || minimum <= 0) {
    throw new RangeError('Minimum grid spacing must be positive and finite.');
  }
  const magnitude = 10 ** Math.floor(Math.log10(minimum));
  const multiplier = [1, 2, 5, 10].find((candidate) => candidate * magnitude >= minimum) ?? 10;
  return multiplier * magnitude;
}
