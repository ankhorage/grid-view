import type {
  GridAxisName,
  GridAxisTick,
  GridTickContext,
  GridTickProvider,
  GridTickSpecification,
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
  const context = getTickContext(viewport, axis, specification);
  if (provider) {
    return getProvidedTicks(provider, context);
  }
  return getGeneratedTicks(context, specification);
}

/*** Derive one axis-specific visible interval for a ruler operation. */
function getTickContext(
  viewport: GridViewport,
  axis: GridAxisName,
  specification: GridTickSpecification,
): GridTickContext {
  const bounds = getVisibleWorldBounds(viewport, specification.overscanPixels ?? 0);
  return axis === 'x'
    ? {
        viewport,
        axis,
        start: bounds.x,
        end: bounds.x + bounds.width,
        pixelsPerUnit: viewport.pixelsPerUnitX,
      }
    : {
        viewport,
        axis,
        start: bounds.y,
        end: bounds.y + bounds.height,
        pixelsPerUnit: viewport.pixelsPerUnitY,
      };
}

/*** Filter externally supplied domain ticks to the visible axis interval. */
function getProvidedTicks(
  provider: GridTickProvider,
  { start, end, ...context }: GridTickContext,
): readonly GridAxisTick[] {
  return provider({ ...context, start, end })
    .filter(
      (tick) => Number.isFinite(tick.position) && tick.position >= start && tick.position <= end,
    )
    .sort((a, b) => a.position - b.position);
}

/*** Generate bounded fixed or adaptive ruler ticks for one visible axis interval. */
function getGeneratedTicks(
  { start, end, pixelsPerUnit }: GridTickContext,
  specification: GridTickSpecification,
): readonly GridAxisTick[] {
  const step =
    specification.mode === 'fixed'
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
      level: tickIndex % majorEvery === 0 ? ('major' as const) : ('minor' as const),
    };
  });
}

/*** Select a readable decade-based ruler increment for a minimum world distance. */
function adaptiveStep(minimum: number): number {
  if (!Number.isFinite(minimum) || minimum <= 0) {
    throw new RangeError('Minimum grid spacing must be positive and finite.');
  }
  const magnitude = 10 ** Math.floor(Math.log10(minimum));
  const multiplier = [1, 2, 5, 10].find((candidate) => candidate * magnitude >= minimum) ?? 10;
  return multiplier * magnitude;
}
