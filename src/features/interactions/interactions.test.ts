import { describe, expect, test } from 'bun:test';

import {
  hitTestWorldRects,
  moveWorldRects,
  resizeWorldRect,
  resolveWorldSnapCandidate,
  selectWorldRects,
} from '../../index.js';

const items = [
  { id: 'first', x: 10, y: 10, width: 10, height: 10 },
  { id: 'overlap', x: 15, y: 15, width: 10, height: 10 },
  { id: 'disabled', x: 30, y: 10, width: 10, height: 10, disabled: true },
  { id: 'locked', x: 40, y: 10, width: 10, height: 10, locked: true },
];

describe('world-space selection and transforms', () => {
  test('hit-tests inclusive rectangle boundaries in stable input order', () => {
    expect(hitTestWorldRects(items, { x: 15, y: 15 })?.id).toBe('first');
    expect(hitTestWorldRects(items, { x: 30, y: 15 })).toBeUndefined();
    expect(hitTestWorldRects(items, { x: 30, y: 15 }, true)?.id).toBe('disabled');
    expect(() => hitTestWorldRects(items, { x: Number.NaN, y: 0 })).toThrow();
  });

  test('normalizes reverse marquees and distinguishes containment from intersection', () => {
    const marquee = { x: 20, y: 20, width: -10, height: -10 };
    expect(selectWorldRects(items, marquee, { mode: 'intersect' })).toEqual(['first', 'overlap']);
    expect(selectWorldRects(items, marquee, { mode: 'contain' })).toEqual(['first']);
  });

  test('moves eligible items by world delta and resizes handles to minimum dimensions', () => {
    expect(moveWorldRects(items, { x: -5, y: 3 })[0]).toMatchObject({ x: 5, y: 13 });
    expect(moveWorldRects(items, { x: -5, y: 3 })[2]).toBe(items[2]);
    const rect = { id: 'resize', x: 10, y: 20, width: 30, height: 40 };
    expect(
      resizeWorldRect(rect, 'top-left', { x: 50, y: 50 }, { minimumWidth: 8, minimumHeight: 9 }),
    ).toEqual({ ...rect, x: 32, y: 51, width: 8, height: 9 });
    expect(resizeWorldRect({ ...rect, resizable: false }, 'right', { x: 4, y: 0 })).toMatchObject(
      rect,
    );
  });
});

describe('world-space candidate snapping', () => {
  test('resolves priority, ties, tolerance, disabled snapping, and scalar fallback', () => {
    const options = {
      pixelsPerUnit: 2,
      tolerancePixels: 8,
      priorities: ['playhead', 'marker', 'guide', 'edge', 'grid'] as const,
      scalarSpecification: { mode: 'fixed' as const, step: 10 },
    };
    expect(
      resolveWorldSnapCandidate(
        102,
        [
          { kind: 'grid', coordinate: 100 },
          { kind: 'guide', coordinate: 105 },
          { kind: 'guide', coordinate: 99 },
        ],
        options,
      ),
    ).toBe(105);
    expect(resolveWorldSnapCandidate(102, [], options)).toBe(100);
    expect(
      resolveWorldSnapCandidate(102, [{ kind: 'guide', coordinate: 103 }], {
        ...options,
        enabled: false,
      }),
    ).toBe(100);
    expect(
      resolveWorldSnapCandidate(102, [{ kind: 'guide', coordinate: 103 }], {
        ...options,
        pixelsPerUnit: 8,
      }),
    ).toBe(103);
    expect(
      resolveWorldSnapCandidate(102, [{ kind: 'guide', coordinate: 104 }], {
        ...options,
        pixelsPerUnit: 8,
      }),
    ).toBe(100);
    expect(() =>
      resolveWorldSnapCandidate(0, [{ kind: 'guide', coordinate: Number.NaN }], options),
    ).toThrow();
  });
});

describe('world-space interaction scale', () => {
  test('handles ten thousand rectangles without constructing a cell grid', () => {
    const many = Array.from({ length: 10_000 }, (_, index) => ({
      id: `item-${index}`,
      x: index,
      y: index % 2,
      width: 1,
      height: 1,
    }));
    expect(
      selectWorldRects(many, { x: 9_999, y: 0, width: 1, height: 2 }, { mode: 'intersect' }),
    ).toEqual(['item-9998', 'item-9999']);
  });
});
