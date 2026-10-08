# Public API

## getAxisTicks

Kind: `function`
Module: `src/features/axes/getAxisTicks.ts`
Source: `src/features/axes/getAxisTicks.ts:8:1`

Generate only visible ruler ticks; a domain adapter may supply irregular boundaries.

### Signatures

- `(viewport: GridViewport, axis: GridAxisName, specification: GridTickSpecification, provider?: GridTickProvider | undefined) => readonly GridAxisTick[]`
  - axis: `GridAxisName`
  - provider: `GridTickProvider | undefined` (optional)
  - specification: `GridTickSpecification`
  - viewport: `GridViewport`
  - returns: `readonly GridAxisTick[]`

## getVisibleGridItems

Kind: `function`
Module: `src/features/items/getVisibleGridItems.ts`
Source: `src/features/items/getVisibleGridItems.ts:6:1`

Cull offscreen rectangular items without materializing logical grid cells.

### Signatures

- `(items: readonly T[], viewport: GridViewport, overscanPixels?: number) => readonly T[]`
  - items: `readonly T[]`
  - overscanPixels: `number` (optional)
  - viewport: `GridViewport`
  - returns: `readonly T[]`

## getVisibleWorldBounds

Kind: `function`
Module: `src/features/viewport/getVisibleWorldBounds.ts`
Source: `src/features/viewport/getVisibleWorldBounds.ts:5:1`

Calculate the visible world rectangle, optionally expanded by pixel overscan.

### Signatures

- `(viewport: GridViewport, overscanPixels?: number) => GridRect`
  - overscanPixels: `number` (optional)
  - viewport: `GridViewport`
  - returns: `GridRect`

## GridAxisCategory

Kind: `type`
Module: `src/types/axes.ts`
Source: `src/types/axes.ts:8:1`

### Members

| Name  | Kind     | Type     | Required | Description |
| ----- | -------- | -------- | -------- | ----------- |
| id    | property | `string` | yes      |             |
| size  | property | `number` | yes      |             |
| start | property | `number` | yes      |             |

## GridAxisDefinition

Kind: `type`
Module: `src/types/axes.ts`
Source: `src/types/axes.ts:15:1`

### Members

| Name       | Kind     | Type                          | Required | Description |
| ---------- | -------- | ----------------------------- | -------- | ----------- |
| categories | property | `readonly GridAxisCategory[]` | no       |             |
| kind       | property | `GridAxisKind`                | yes      |             |
| origin     | property | `number`                      | no       |             |

## GridAxisKind

Kind: `unknown`
Module: `src/types/axes.ts`
Source: `src/types/axes.ts:4:1`

## GridAxisName

Kind: `unknown`
Module: `src/types/axes.ts`
Source: `src/types/axes.ts:5:1`

## GridAxisTick

Kind: `type`
Module: `src/types/axes.ts`
Source: `src/types/axes.ts:22:1`

### Members

| Name     | Kind     | Type                 | Required | Description |
| -------- | -------- | -------------------- | -------- | ----------- |
| label    | property | `string`             | no       |             |
| level    | property | `"major" \| "minor"` | yes      |             |
| position | property | `number`             | yes      |             |

## GridPoint

Kind: `type`
Module: `src/types/grid.ts`
Source: `src/types/grid.ts:2:1`

### Members

| Name | Kind     | Type     | Required | Description |
| ---- | -------- | -------- | -------- | ----------- |
| x    | property | `number` | yes      |             |
| y    | property | `number` | yes      |             |

## GridRect

Kind: `type`
Module: `src/types/grid.ts`
Source: `src/types/grid.ts:8:1`

### Members

| Name   | Kind     | Type     | Required | Description |
| ------ | -------- | -------- | -------- | ----------- |
| height | property | `number` | yes      |             |
| width  | property | `number` | yes      |             |
| x      | property | `number` | yes      |             |
| y      | property | `number` | yes      |             |

## GridRectItem

Kind: `type`
Module: `src/types/items.ts`
Source: `src/types/items.ts:4:1`

### Members

| Name   | Kind     | Type     | Required | Description |
| ------ | -------- | -------- | -------- | ----------- |
| height | property | `number` | yes      |             |
| id     | property | `string` | yes      |             |
| width  | property | `number` | yes      |             |
| x      | property | `number` | yes      |             |
| y      | property | `number` | yes      |             |

## GridSnapResolver

Kind: `unknown`
Module: `src/types/snap.ts`
Source: `src/types/snap.ts:7:1`

## GridSnapSpecification

Kind: `unknown`
Module: `src/types/snap.ts`
Source: `src/types/snap.ts:2:1`

## GridTickContext

Kind: `type`
Module: `src/types/axes.ts`
Source: `src/types/axes.ts:47:1`

### Members

| Name          | Kind     | Type           | Required | Description |
| ------------- | -------- | -------------- | -------- | ----------- |
| axis          | property | `GridAxisName` | yes      |             |
| end           | property | `number`       | yes      |             |
| pixelsPerUnit | property | `number`       | yes      |             |
| start         | property | `number`       | yes      |             |
| viewport      | property | `GridViewport` | yes      |             |

## GridTickProvider

Kind: `unknown`
Module: `src/types/axes.ts`
Source: `src/types/axes.ts:55:1`

## GridTickSpecification

Kind: `unknown`
Module: `src/types/axes.ts`
Source: `src/types/axes.ts:28:1`

## GridViewport

Kind: `type`
Module: `src/types/grid.ts`
Source: `src/types/grid.ts:14:1`

### Members

| Name           | Kind     | Type     | Required | Description |
| -------------- | -------- | -------- | -------- | ----------- |
| height         | property | `number` | yes      |             |
| offsetX        | property | `number` | yes      |             |
| offsetY        | property | `number` | yes      |             |
| pixelsPerUnitX | property | `number` | yes      |             |
| pixelsPerUnitY | property | `number` | yes      |             |
| width          | property | `number` | yes      |             |

## GridZoomLimits

Kind: `type`
Module: `src/types/grid.ts`
Source: `src/types/grid.ts:24:1`

### Members

| Name | Kind     | Type     | Required | Description |
| ---- | -------- | -------- | -------- | ----------- |
| maxX | property | `number` | no       |             |
| maxY | property | `number` | no       |             |
| minX | property | `number` | no       |             |
| minY | property | `number` | no       |             |

## panViewport

Kind: `function`
Module: `src/features/viewport/panViewport.ts`
Source: `src/features/viewport/panViewport.ts:4:1`

Pan by pixel displacement; dragging to the right reveals world coordinates to the left.

### Signatures

- `(viewport: GridViewport, displacement: GridPoint) => GridViewport`
  - displacement: `GridPoint`
  - viewport: `GridViewport`
  - returns: `GridViewport`

## snapWorldCoordinate

Kind: `function`
Module: `src/features/snap/snapWorldCoordinate.ts`
Source: `src/features/snap/snapWorldCoordinate.ts:4:1`

Snap a world coordinate without consulting zoom or grid-line density.

### Signatures

- `(value: number, specification: GridSnapSpecification, resolver?: GridSnapResolver | undefined) => number`
  - resolver: `GridSnapResolver | undefined` (optional)
  - specification: `GridSnapSpecification`
  - value: `number`
  - returns: `number`

## viewportToWorld

Kind: `function`
Module: `src/features/viewport/viewportToWorld.ts`
Source: `src/features/viewport/viewportToWorld.ts:4:1`

Transform a viewport pixel coordinate back into world space.

### Signatures

- `(point: GridPoint, viewport: GridViewport) => GridPoint`
  - point: `GridPoint`
  - viewport: `GridViewport`
  - returns: `GridPoint`

## worldToViewport

Kind: `function`
Module: `src/features/viewport/worldToViewport.ts`
Source: `src/features/viewport/worldToViewport.ts:4:1`

Transform stable world coordinates to screen pixels.

### Signatures

- `(point: GridPoint, viewport: GridViewport) => GridPoint`
  - point: `GridPoint`
  - viewport: `GridViewport`
  - returns: `GridPoint`

## zoomViewportAt

Kind: `function`
Module: `src/features/viewport/zoomViewportAt.ts`
Source: `src/features/viewport/zoomViewportAt.ts:5:1`

Zoom around a fixed pixel focal point without moving its underlying world coordinate.

### Signatures

- `(viewport: GridViewport, focalPoint: GridPoint, nextScale: Pick<GridViewport, "pixelsPerUnitX" | "pixelsPerUnitY">, limits?: GridZoomLimits) => GridViewport`
  - focalPoint: `GridPoint`
  - limits: `GridZoomLimits` (optional)
  - nextScale: `Pick<GridViewport, "pixelsPerUnitX" | "pixelsPerUnitY">`
  - viewport: `GridViewport`
  - returns: `GridViewport`
