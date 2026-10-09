import { describe, expect, test } from 'bun:test';

import {
  constrainViewport,
  getAxisCategoryTicks,
  getAxisTicks,
  getVisibleGridItems,
  getVisibleWorldBounds,
  panViewport,
  revealWorldRect,
  snapWorldCoordinate,
  viewportToWorld,
  worldToViewport,
  zoomViewportAt,
} from '../index.js';
import type { GridViewport, GridViewportConstraints } from '../types/grid.js';

const viewport: GridViewport = {
  width: 800,
  height: 400,
  offsetX: 100,
  offsetY: 10,
  pixelsPerUnitX: 4,
  pixelsPerUnitY: 20,
};

describe('coordinate engine', () => {
  test('roundtrips world and viewport coordinates', () => {
    const point = { x: 125.25, y: 17 };
    expect(viewportToWorld(worldToViewport(point, viewport), viewport)).toEqual(point);
  });

  test('focal zoom preserves the coordinate under the cursor, including independent axis scales', () => {
    const focalPoint = { x: 230, y: 91 };
    const initial = viewportToWorld(focalPoint, viewport);
    const zoomed = zoomViewportAt(
      viewport,
      focalPoint,
      {
        pixelsPerUnitX: 8,
        pixelsPerUnitY: 20,
      },
      { minX: 2, maxX: 16 },
    );
    expect(viewportToWorld(focalPoint, zoomed)).toEqual(initial);
    expect(zoomed.pixelsPerUnitY).toBe(20);
    expect(
      zoomViewportAt(
        viewport,
        focalPoint,
        {
          pixelsPerUnitX: 99,
          pixelsPerUnitY: 20,
        },
        { maxX: 16 },
      ).pixelsPerUnitX,
    ).toBe(16);
  });

  test('pixel pan and pixel overscan map into world units', () => {
    expect(panViewport(viewport, { x: 40, y: -20 }).offsetX).toBe(90);
    expect(getVisibleWorldBounds(viewport, 40)).toEqual({
      x: 90,
      y: 8,
      width: 220,
      height: 24,
    });
  });

  test('invalid scales and overscan are rejected', () => {
    expect(() => viewportToWorld({ x: 0, y: 0 }, { ...viewport, pixelsPerUnitX: 0 })).toThrow();
    expect(() => getVisibleWorldBounds(viewport, -1)).toThrow();
  });
});

describe('viewport visibility', () => {
  test('reveals a world rectangle with the smallest necessary independent-axis pan', () => {
    expect(revealWorldRect(viewport, { x: 50, y: 35, width: 20, height: 2 })).toEqual({
      ...viewport,
      offsetX: 50,
      offsetY: 17,
    });
    expect(revealWorldRect(viewport, { x: 105, y: 12, width: 10, height: 2 })).toEqual(viewport);
    expect(revealWorldRect(viewport, { x: 295, y: 12, width: 10, height: 2 })).toEqual({
      ...viewport,
      offsetX: 105,
    });
  });

  test('uses viewport-pixel padding and leading alignment for oversized rectangles', () => {
    expect(revealWorldRect(viewport, { x: 96, y: 9, width: 400, height: 100 }, 20)).toEqual({
      ...viewport,
      offsetX: 91,
      offsetY: 8,
    });
    expect(() => revealWorldRect(viewport, { x: 0, y: 0, width: -1, height: 1 })).toThrow();
    expect(() => revealWorldRect(viewport, { x: 0, y: 0, width: 1, height: 1 }, 400)).toThrow();
    expect(() =>
      revealWorldRect({ ...viewport, offsetX: Number.NaN }, { x: 0, y: 0, width: 1, height: 1 }),
    ).toThrow();
    expect(() =>
      revealWorldRect({ ...viewport, height: Infinity }, { x: 0, y: 0, width: 1, height: 1 }),
    ).toThrow();
  });
});

describe('constrained 2D viewport interaction', () => {
  const constraints: GridViewportConstraints = {
    world: { x: 0, y: 0, width: 300, height: 100 },
  };

  test('clamps pan independently at every finite world edge, including large offsets', () => {
    expect(panViewport(viewport, { x: 10_000, y: 10_000 }, constraints)).toMatchObject({
      offsetX: 0,
      offsetY: 0,
    });
    expect(panViewport(viewport, { x: -10_000, y: -10_000 }, constraints)).toMatchObject({
      offsetX: 100,
      offsetY: 80,
    });
    expect(
      panViewport(viewport, { x: -10_000, y: 0 }, { ...constraints, overscrollX: 5 }),
    ).toMatchObject({ offsetX: 105 });
  });

  test('aligns world content smaller than a viewport deterministically', () => {
    const smallWorld = { world: { x: 10, y: 20, width: 50, height: 10 } };
    expect(constrainViewport(viewport, smallWorld)).toMatchObject({ offsetX: -65, offsetY: 15 });
    expect(
      constrainViewport(viewport, { ...smallWorld, alignmentX: 'start', alignmentY: 'end' }),
    ).toMatchObject({ offsetX: 10, offsetY: 10 });
  });
});

describe('constrained zoom and reveal', () => {
  const constraints: GridViewportConstraints = {
    world: { x: 0, y: 0, width: 300, height: 100 },
  };

  test('keeps focal world coordinates through asymmetric zoom until bounds intervene', () => {
    const focal = { x: 400, y: 200 };
    const initial = viewportToWorld(focal, viewport);
    const zoomed = zoomViewportAt(
      viewport,
      focal,
      { pixelsPerUnitX: 8, pixelsPerUnitY: 10 },
      { minX: 2, maxX: 16, minY: 5, maxY: 20 },
      constraints,
    );
    expect(viewportToWorld(focal, zoomed)).toEqual(initial);
    expect(zoomed).toMatchObject({ pixelsPerUnitX: 8, pixelsPerUnitY: 10 });
    expect(
      zoomViewportAt(viewport, focal, { pixelsPerUnitX: 1, pixelsPerUnitY: 1 }, {}, constraints),
    ).toMatchObject({ offsetX: -250, offsetY: -150 });
  });

  test('constrains reveal results and rejects invalid finite geometry consistently', () => {
    expect(
      revealWorldRect(viewport, { x: 290, y: 90, width: 10, height: 10 }, 0, constraints),
    ).toMatchObject({ offsetX: 100, offsetY: 80 });
    expect(() => panViewport(viewport, { x: Infinity, y: 0 })).toThrow();
    expect(() =>
      constrainViewport(viewport, { world: { x: 0, y: 0, width: Infinity, height: 1 } }),
    ).toThrow();
    expect(() =>
      zoomViewportAt(
        viewport,
        { x: 0, y: 0 },
        { pixelsPerUnitX: 1, pixelsPerUnitY: 1 },
        { minX: 2, maxX: 1 },
      ),
    ).toThrow();
    expect(() => worldToViewport({ x: Number.NaN, y: 0 }, viewport)).toThrow();
  });
});

describe('visual ruler versus interaction snap', () => {
  test('snapping does not change across visual grid zoom levels', () => {
    const sixteenth = { mode: 'fixed' as const, step: 240 };
    expect(snapWorldCoordinate(491, sixteenth)).toBe(480);
    expect(snapWorldCoordinate(491, sixteenth)).toBe(480);
    const far = getAxisTicks(viewport, 'x', { mode: 'adaptive', minPixelSpacing: 40 });
    const near = getAxisTicks({ ...viewport, pixelsPerUnitX: 40 }, 'x', {
      mode: 'adaptive',
      minPixelSpacing: 40,
    });
    expect(far[1]?.position).not.toBe(near[1]?.position);
    expect(snapWorldCoordinate(491, sixteenth)).toBe(480);
    expect(snapWorldCoordinate(491, { mode: 'off' })).toBe(491);
  });

  test('fixed display tick budgets avoid huge cell materialization', () => {
    expect(() =>
      getAxisTicks(viewport, 'x', {
        mode: 'fixed',
        step: 0.001,
        maxTicks: 10,
      }),
    ).toThrow();
    expect(
      getAxisTicks(viewport, 'x', { mode: 'fixed', step: 25, majorEvery: 4 }).some(
        ({ level }) => level === 'minor',
      ),
    ).toBe(true);
  });
});

describe('axis projection geometry', () => {
  test('emits only visible variable-width category boundaries without changing snap', () => {
    expect(
      getAxisCategoryTicks(viewport, 'x', [
        { id: 'before', start: 99, size: 1 },
        { id: 'one', start: 100, size: 37 },
        { id: 'two', start: 137, size: 113 },
        { id: 'three', start: 250, size: 50 },
        { id: 'after', start: 301, size: 1 },
      ]),
    ).toEqual([
      { categoryId: 'one', level: 'major', position: 100 },
      { categoryId: 'two', level: 'major', position: 137 },
      { categoryId: 'three', level: 'major', position: 250 },
    ]);
    expect(snapWorldCoordinate(491, { mode: 'fixed', step: 240 })).toBe(480);
  });
});

describe('DAW ruler fixture', () => {
  test('preserves 4/4 to 7/8 bar lengths, triplets and irregular ruler ticks', () => {
    const ppq = 960;
    const fourFour = 4 * ppq;
    const sevenEight = (7 * ppq) / 2;
    const boundaries = [0, fourFour, fourFour + sevenEight];
    const musicViewport: GridViewport = {
      width: 800,
      height: 200,
      offsetX: 0,
      offsetY: 0,
      pixelsPerUnitX: 0.12,
      pixelsPerUnitY: 20,
    };
    const ticks = getAxisTicks(musicViewport, 'x', { mode: 'adaptive' }, ({ start, end }) =>
      boundaries
        .filter((position) => position >= start && position <= end)
        .map((position) => ({ position, level: 'major' as const })),
    );
    expect(ticks.map(({ position }) => position)).toEqual([0, 3840]);
    expect(snapWorldCoordinate(310, { mode: 'fixed', step: ppq / 3 })).toBe(320);
    expect(snapWorldCoordinate(251, { mode: 'fixed', step: ppq / 4 })).toBe(240);
    expect(fourFour + sevenEight).toBe(7200);
  });
});

describe('virtualized foundation', () => {
  test('culls rects in world space with stable IDs and overscan', () => {
    const items = [
      { id: 'offscreen', x: -100, y: 20, width: 5, height: 2 },
      { id: 'visible', x: 200, y: 20, width: 50, height: 2 },
      { id: 'overscan', x: 305, y: 20, width: 5, height: 2 },
    ];
    expect(getVisibleGridItems(items, viewport).map(({ id }) => id)).toEqual(['visible']);
    expect(getVisibleGridItems(items, viewport, 40).map(({ id }) => id)).toEqual([
      'visible',
      'overscan',
    ]);
  });
});
