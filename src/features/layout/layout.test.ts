import { describe, expect, test } from 'bun:test';

import {
  getLaneIntervalPlacement,
  getMatrixCellPlacement,
  getVisibleLaneIntervals,
  getVisibleMatrixCells,
} from '../../index.js';

const matrixLayout = {
  rows: [
    { id: 'r0', size: 10 },
    { id: 'r1', size: 20 },
    { id: 'r2', size: 5 },
  ],
  columns: [
    { id: 'c0', size: 50 },
    { id: 'c1', size: 30 },
    { id: 'c2', size: 40 },
  ],
};

const lanes = Array.from({ length: 100 }, (_, index) => ({
  id: `lane${index}`,
  height: index % 2 === 0 ? 10 : 20,
}));

describe('headless matrix layout', () => {
  test('places sparse cells from variable row and column metrics', () => {
    expect(
      getMatrixCellPlacement(matrixLayout, { id: 'cell', rowId: 'r1', columnId: 'c1' }),
    ).toMatchObject({
      rowIndex: 1,
      columnIndex: 1,
      x: 50,
      y: 10,
      width: 30,
      height: 20,
    });
  });

  test('enumerates a 10k sparse catalogue without materializing its 100m-cell logical matrix', () => {
    const layout = createLargeMatrixLayout();
    const cells = Array.from({ length: 10_000 }, (_, index) => ({
      id: `cell${index}`,
      rowId: `r${index}`,
      columnId: `c${index}`,
    }));
    const visible = getVisibleMatrixCells(layout, cells, createViewport(50_000, 50_000));
    expect(visible.map(({ id }) => id)).toEqual(['cell4999', 'cell5000', 'cell5001']);
  });

  test('keeps cell IDs stable through two-axis culling and includes shared boundaries', () => {
    const cells = [
      { id: 'before', rowId: 'r0', columnId: 'c0' },
      { id: 'edge', rowId: 'r1', columnId: 'c1' },
      { id: 'inside', rowId: 'r1', columnId: 'c2' },
    ];
    const visible = getVisibleMatrixCells(matrixLayout, cells, createViewport(80, 10, 40, 20));
    expect(visible.map(({ id }) => id)).toEqual(['edge', 'inside']);
  });
});

describe('headless interval lanes', () => {
  test('places intervals in ordered variable-height lanes', () => {
    expect(
      getLaneIntervalPlacement(lanes, { id: 'interval', laneId: 'lane2', start: 12, extent: 8 }),
    ).toMatchObject({ laneIndex: 2, x: 12, y: 30, width: 8, height: 10 });
  });

  test('culls intervals on both axes, preserves input identities, and retains boundary overlaps', () => {
    const intervals = [
      { id: 'offscreen-lane', laneId: 'lane99', start: 100, extent: 20 },
      { id: 'before', laneId: 'lane2', start: 10, extent: 10 },
      { id: 'boundary', laneId: 'lane2', start: 20, extent: 10 },
      { id: 'inside', laneId: 'lane3', start: 21, extent: 3 },
    ];
    const visible = getVisibleLaneIntervals(lanes, intervals, createViewport(20, 30));
    expect(visible.map(({ id }) => id)).toEqual(['before', 'boundary', 'inside']);
  });
});

describe('layout validation', () => {
  test('rejects invalid geometry and unknown topology', () => {
    expect(() =>
      getMatrixCellPlacement(
        { rows: [{ id: 'r', size: 0 }], columns: [] },
        { id: 'x', rowId: 'r', columnId: 'c' },
      ),
    ).toThrow();
    expect(() =>
      getLaneIntervalPlacement(lanes, { id: 'x', laneId: 'missing', start: 0, extent: 1 }),
    ).toThrow();
    expect(() =>
      getLaneIntervalPlacement(lanes, { id: 'x', laneId: 'lane0', start: 0, extent: 0 }),
    ).toThrow();
  });

  test('rejects duplicate catalogue identities', () => {
    expect(() =>
      getVisibleMatrixCells(
        matrixLayout,
        [
          { id: 'duplicate', rowId: 'r0', columnId: 'c0' },
          { id: 'duplicate', rowId: 'r1', columnId: 'c1' },
        ],
        createViewport(0, 0),
      ),
    ).toThrow();
  });
});

/*** Create large variable-topology inputs without ever constructing their logical cell product. */
function createLargeMatrixLayout() {
  return {
    rows: Array.from({ length: 10_000 }, (_, index) => ({ id: `r${index}`, size: 10 })),
    columns: Array.from({ length: 10_000 }, (_, index) => ({ id: `c${index}`, size: 10 })),
  };
}

/*** Create a world-coordinate viewport for concise layout fixtures. */
function createViewport(offsetX: number, offsetY: number, width = 10, height = 30) {
  return { width, height, offsetX, offsetY, pixelsPerUnitX: 1, pixelsPerUnitY: 1 };
}
