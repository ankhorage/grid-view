import { describe, expect, test } from 'bun:test';

import {
  getAxisTicks,
  getVisibleGridItems,
  getVisibleWorldBounds,
  panViewport,
  snapWorldCoordinate,
  viewportToWorld,
  worldToViewport,
  zoomViewportAt,
} from '../index.js';
import type { GridViewport } from '../types/grid.js';

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

  test('DAW musical fixture: 4/4 to 7/8 bar lengths, triplets and irregular ruler', () => {
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
