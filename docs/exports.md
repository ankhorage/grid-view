# Public API

## constrainViewport

Kind: `function`
Module: `src/features/viewport/constrainViewport.ts`
Source: `src/features/viewport/constrainViewport.ts:9:1`

Constrain a viewport to finite world bounds while preserving valid unconstrained viewports.

### Signatures

- `(viewport: GridViewport, constraints?: GridViewportConstraints | undefined) => GridViewport`
  - constraints: `GridViewportConstraints | undefined` (optional)
  - viewport: `GridViewport`
  - returns: `GridViewport`

## getAxisCategoryTicks

Kind: `function`
Module: `src/features/axes/getAxisCategoryTicks.ts`
Source: `src/features/axes/getAxisCategoryTicks.ts:6:1`

Project variable-width category starts into visible-only major ruler tick candidates.

### Signatures

- `(viewport: GridViewport, axis: GridAxisName, categories: readonly GridAxisCategory[]) => readonly GridAxisCategoryTick[]`
  - axis: `GridAxisName`
  - categories: `readonly GridAxisCategory[]`
  - viewport: `GridViewport`
  - returns: `readonly GridAxisCategoryTick[]`

## getAxisTicks

Kind: `function`
Module: `src/features/axes/getAxisTicks.ts`
Source: `src/features/axes/getAxisTicks.ts:12:1`

Generate only visible ruler ticks; a domain adapter may supply irregular boundaries.

### Signatures

- `(viewport: GridViewport, axis: GridAxisName, specification: GridTickSpecification, provider?: GridTickProvider | undefined) => readonly GridAxisTick[]`
  - axis: `GridAxisName`
  - provider: `GridTickProvider | undefined` (optional)
  - specification: `GridTickSpecification`
  - viewport: `GridViewport`
  - returns: `readonly GridAxisTick[]`

## getLaneIntervalPlacement

Kind: `function`
Module: `src/features/layout/getLaneIntervalPlacement.ts`
Source: `src/features/layout/getLaneIntervalPlacement.ts:6:1`

Resolve one lane interval into its deterministic world-space rectangle.

### Signatures

- `(lanes: readonly GridLane[], interval: GridLaneInterval) => GridLaneIntervalPlacement`
  - interval: `GridLaneInterval`
  - lanes: `readonly GridLane[]`
  - returns: `GridLaneIntervalPlacement`

## getMatrixCellPlacement

Kind: `function`
Module: `src/features/layout/getMatrixCellPlacement.ts`
Source: `src/features/layout/getMatrixCellPlacement.ts:10:1`

Resolve one sparse matrix cell into its deterministic world-space rectangle.

### Signatures

- `(layout: GridMatrixLayout, cell: GridMatrixCell) => GridMatrixCellPlacement`
  - cell: `GridMatrixCell`
  - layout: `GridMatrixLayout`
  - returns: `GridMatrixCellPlacement`

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

## getVisibleLaneIntervals

Kind: `function`
Module: `src/features/layout/getVisibleLaneIntervals.ts`
Source: `src/features/layout/getVisibleLaneIntervals.ts:8:1`

Enumerate lane intervals intersecting both viewport axes in stable input order.

### Signatures

- `(lanes: readonly GridLane[], intervals: readonly GridLaneInterval[], viewport: GridViewport, overscanPixels?: number) => readonly GridLaneIntervalPlacement[]`
  - intervals: `readonly GridLaneInterval[]`
  - lanes: `readonly GridLane[]`
  - overscanPixels: `number` (optional)
  - viewport: `GridViewport`
  - returns: `readonly GridLaneIntervalPlacement[]`

## getVisibleMatrixCells

Kind: `function`
Module: `src/features/layout/getVisibleMatrixCells.ts`
Source: `src/features/layout/getVisibleMatrixCells.ts:13:1`

Enumerate only sparse matrix cells intersecting the viewport in stable input order.

### Signatures

- `(layout: GridMatrixLayout, cells: readonly GridMatrixCell[], viewport: GridViewport, overscanPixels?: number) => readonly GridMatrixCellPlacement[]`
  - cells: `readonly GridMatrixCell[]`
  - layout: `GridMatrixLayout`
  - overscanPixels: `number` (optional)
  - viewport: `GridViewport`
  - returns: `readonly GridMatrixCellPlacement[]`

## getVisibleWorldBounds

Kind: `function`
Module: `src/features/viewport/getVisibleWorldBounds.ts`
Source: `src/features/viewport/getVisibleWorldBounds.ts:6:1`

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

| Name | Kind | Type | Required | Description |
| --- | --- | --- | --- | --- |
| id | property | `string` | yes |  |
| size | property | `number` | yes |  |
| start | property | `number` | yes |  |

## GridAxisCategoryTick

Kind: `type`
Module: `src/types/axes.ts`
Source: `src/types/axes.ts:15:1`

### Members

| Name | Kind | Type | Required | Description |
| --- | --- | --- | --- | --- |
| categoryId | property | `string` | yes |  |
| label | property | `string` | no |  |
| level | property | `"major" \| "minor"` | yes |  |
| position | property | `number` | yes |  |

## GridAxisDefinition

Kind: `type`
Module: `src/types/axes.ts`
Source: `src/types/axes.ts:20:1`

### Members

| Name | Kind | Type | Required | Description |
| --- | --- | --- | --- | --- |
| categories | property | `readonly GridAxisCategory[]` | no |  |
| kind | property | `GridAxisKind` | yes |  |
| origin | property | `number` | no |  |

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
Source: `src/types/axes.ts:27:1`

### Members

| Name | Kind | Type | Required | Description |
| --- | --- | --- | --- | --- |
| label | property | `string` | no |  |
| level | property | `"major" \| "minor"` | yes |  |
| position | property | `number` | yes |  |

## GridCandidateSnapOptions

Kind: `type`
Module: `src/types/interactions.ts`
Source: `src/types/interactions.ts:48:1`

### Members

| Name | Kind | Type | Required | Description |
| --- | --- | --- | --- | --- |
| enabled | property | `boolean` | no |  |
| pixelsPerUnit | property | `number` | yes |  |
| priorities | property | `readonly GridSnapCandidateKind[]` | yes |  |
| scalarResolver | property | `GridSnapResolver` | no |  |
| scalarSpecification | property | `GridSnapSpecification` | no |  |
| tolerancePixels | property | `number` | yes |  |

## GridInteractionRectItem

Kind: `type`
Module: `src/types/interactions.ts`
Source: `src/types/interactions.ts:5:1`

### Members

| Name | Kind | Type | Required | Description |
| --- | --- | --- | --- | --- |
| disabled | property | `boolean` | no |  |
| height | property | `number` | yes |  |
| id | property | `string` | yes |  |
| locked | property | `boolean` | no |  |
| resizable | property | `boolean` | no |  |
| width | property | `number` | yes |  |
| x | property | `number` | yes |  |
| y | property | `number` | yes |  |

## GridLane

Kind: `type`
Module: `src/types/layout.ts`
Source: `src/types/layout.ts:38:1`

### Members

| Name | Kind | Type | Required | Description |
| --- | --- | --- | --- | --- |
| height | property | `number` | yes |  |
| id | property | `string` | yes |  |

## GridLaneInterval

Kind: `type`
Module: `src/types/layout.ts`
Source: `src/types/layout.ts:44:1`

### Members

| Name | Kind | Type | Required | Description |
| --- | --- | --- | --- | --- |
| extent | property | `number` | yes |  |
| id | property | `string` | yes |  |
| laneId | property | `string` | yes |  |
| start | property | `number` | yes |  |

## GridLaneIntervalPlacement

Kind: `type`
Module: `src/types/layout.ts`
Source: `src/types/layout.ts:52:1`

### Members

| Name | Kind | Type | Required | Description |
| --- | --- | --- | --- | --- |
| extent | property | `number` | yes |  |
| height | property | `number` | yes |  |
| id | property | `string` | yes |  |
| laneId | property | `string` | yes |  |
| laneIndex | property | `number` | yes |  |
| start | property | `number` | yes |  |
| width | property | `number` | yes |  |
| x | property | `number` | yes |  |
| y | property | `number` | yes |  |

## GridMarqueeSelectionMode

Kind: `unknown`
Module: `src/types/interactions.ts`
Source: `src/types/interactions.ts:12:1`

## GridMarqueeSelectionOptions

Kind: `type`
Module: `src/types/interactions.ts`
Source: `src/types/interactions.ts:15:1`

### Members

| Name | Kind | Type | Required | Description |
| --- | --- | --- | --- | --- |
| includeDisabled | property | `boolean` | no |  |
| mode | property | `GridMarqueeSelectionMode` | yes |  |

## GridMatrixAxisEntry

Kind: `type`
Module: `src/types/layout.ts`
Source: `src/types/layout.ts:2:1`

### Members

| Name | Kind | Type | Required | Description |
| --- | --- | --- | --- | --- |
| id | property | `string` | yes |  |
| size | property | `number` | yes |  |

## GridMatrixCell

Kind: `type`
Module: `src/types/layout.ts`
Source: `src/types/layout.ts:8:1`

### Members

| Name | Kind | Type | Required | Description |
| --- | --- | --- | --- | --- |
| columnId | property | `string` | yes |  |
| id | property | `string` | yes |  |
| rowId | property | `string` | yes |  |

## GridMatrixCellPlacement

Kind: `type`
Module: `src/types/layout.ts`
Source: `src/types/layout.ts:28:1`

### Members

| Name | Kind | Type | Required | Description |
| --- | --- | --- | --- | --- |
| columnId | property | `string` | yes |  |
| columnIndex | property | `number` | yes |  |
| height | property | `number` | yes |  |
| id | property | `string` | yes |  |
| rowId | property | `string` | yes |  |
| rowIndex | property | `number` | yes |  |
| width | property | `number` | yes |  |
| x | property | `number` | yes |  |
| y | property | `number` | yes |  |

## GridMatrixLayout

Kind: `type`
Module: `src/types/layout.ts`
Source: `src/types/layout.ts:15:1`

### Members

| Name | Kind | Type | Required | Description |
| --- | --- | --- | --- | --- |
| columns | property | `readonly GridMatrixAxisEntry[]` | yes |  |
| rows | property | `readonly GridMatrixAxisEntry[]` | yes |  |

## GridMoveOptions

Kind: `type`
Module: `src/types/interactions.ts`
Source: `src/types/interactions.ts:21:1`

### Members

| Name | Kind | Type | Required | Description |
| --- | --- | --- | --- | --- |
| includeDisabled | property | `boolean` | no |  |
| includeLocked | property | `boolean` | no |  |

## GridPoint

Kind: `type`
Module: `src/types/grid.ts`
Source: `src/types/grid.ts:2:1`

### Members

| Name | Kind | Type | Required | Description |
| --- | --- | --- | --- | --- |
| x | property | `number` | yes |  |
| y | property | `number` | yes |  |

## GridRect

Kind: `type`
Module: `src/types/grid.ts`
Source: `src/types/grid.ts:8:1`

### Members

| Name | Kind | Type | Required | Description |
| --- | --- | --- | --- | --- |
| height | property | `number` | yes |  |
| width | property | `number` | yes |  |
| x | property | `number` | yes |  |
| y | property | `number` | yes |  |

## GridRectItem

Kind: `type`
Module: `src/types/items.ts`
Source: `src/types/items.ts:4:1`

### Members

| Name | Kind | Type | Required | Description |
| --- | --- | --- | --- | --- |
| height | property | `number` | yes |  |
| id | property | `string` | yes |  |
| width | property | `number` | yes |  |
| x | property | `number` | yes |  |
| y | property | `number` | yes |  |

## GridResizeHandle

Kind: `unknown`
Module: `src/types/interactions.ts`
Source: `src/types/interactions.ts:27:1`

## GridResizeOptions

Kind: `type`
Module: `src/types/interactions.ts`
Source: `src/types/interactions.ts:31:1`

### Members

| Name | Kind | Type | Required | Description |
| --- | --- | --- | --- | --- |
| includeDisabled | property | `boolean` | no |  |
| includeLocked | property | `boolean` | no |  |
| minimumHeight | property | `number` | no |  |
| minimumWidth | property | `number` | no |  |

## GridSnapCandidate

Kind: `type`
Module: `src/types/interactions.ts`
Source: `src/types/interactions.ts:42:1`

### Members

| Name | Kind | Type | Required | Description |
| --- | --- | --- | --- | --- |
| coordinate | property | `number` | yes |  |
| kind | property | `GridSnapCandidateKind` | yes |  |

## GridSnapCandidateKind

Kind: `unknown`
Module: `src/types/interactions.ts`
Source: `src/types/interactions.ts:39:1`

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
Source: `src/types/axes.ts:52:1`

### Members

| Name | Kind | Type | Required | Description |
| --- | --- | --- | --- | --- |
| axis | property | `GridAxisName` | yes |  |
| end | property | `number` | yes |  |
| pixelsPerUnit | property | `number` | yes |  |
| start | property | `number` | yes |  |
| viewport | property | `GridViewport` | yes |  |

## GridTickProvider

Kind: `unknown`
Module: `src/types/axes.ts`
Source: `src/types/axes.ts:60:1`

## GridTickSpecification

Kind: `unknown`
Module: `src/types/axes.ts`
Source: `src/types/axes.ts:33:1`

## GridViewport

Kind: `type`
Module: `src/types/grid.ts`
Source: `src/types/grid.ts:14:1`

### Members

| Name | Kind | Type | Required | Description |
| --- | --- | --- | --- | --- |
| height | property | `number` | yes |  |
| offsetX | property | `number` | yes |  |
| offsetY | property | `number` | yes |  |
| pixelsPerUnitX | property | `number` | yes |  |
| pixelsPerUnitY | property | `number` | yes |  |
| width | property | `number` | yes |  |

## GridViewportAlignment

Kind: `unknown`
Module: `src/types/grid.ts`
Source: `src/types/grid.ts:32:1`

## GridViewportConstraints

Kind: `type`
Module: `src/types/grid.ts`
Source: `src/types/grid.ts:39:1`

### Members

| Name | Kind | Type | Required | Description |
| --- | --- | --- | --- | --- |
| alignmentX | property | `GridViewportAlignment` | no |  |
| alignmentY | property | `GridViewportAlignment` | no |  |
| overscrollX | property | `number` | no |  |
| overscrollY | property | `number` | no |  |
| world | property | `GridRect` | yes |  |

## GridZoomLimits

Kind: `type`
Module: `src/types/grid.ts`
Source: `src/types/grid.ts:24:1`

### Members

| Name | Kind | Type | Required | Description |
| --- | --- | --- | --- | --- |
| maxX | property | `number` | no |  |
| maxY | property | `number` | no |  |
| minX | property | `number` | no |  |
| minY | property | `number` | no |  |

## hitTestWorldRects

Kind: `function`
Module: `src/features/interactions/hitTestWorldRects.ts`
Source: `src/features/interactions/hitTestWorldRects.ts:6:1`

Return the first input-order world rectangle containing a finite point.

### Signatures

- `(items: readonly T[], point: GridPoint, includeDisabled?: boolean) => T | undefined`
  - includeDisabled: `boolean` (optional)
  - items: `readonly T[]`
  - point: `GridPoint`
  - returns: `T | undefined`

## moveWorldRects

Kind: `function`
Module: `src/features/interactions/moveWorldRects.ts`
Source: `src/features/interactions/moveWorldRects.ts:6:1`

Move eligible world rectangles by a finite world delta while retaining input order and IDs.

### Signatures

- `(items: readonly T[], delta: GridPoint, options?: GridMoveOptions) => readonly T[]`
  - delta: `GridPoint`
  - items: `readonly T[]`
  - options: `GridMoveOptions` (optional)
  - returns: `readonly T[]`

## panViewport

Kind: `function`
Module: `src/features/viewport/panViewport.ts`
Source: `src/features/viewport/panViewport.ts:5:1`

Pan by pixel displacement; dragging to the right reveals world coordinates to the left.

### Signatures

- `(viewport: GridViewport, displacement: GridPoint, constraints?: GridViewportConstraints | undefined) => GridViewport`
  - constraints: `GridViewportConstraints | undefined` (optional)
  - displacement: `GridPoint`
  - viewport: `GridViewport`
  - returns: `GridViewport`

## resizeWorldRect

Kind: `function`
Module: `src/features/interactions/resizeWorldRect.ts`
Source: `src/features/interactions/resizeWorldRect.ts:10:1`

Resize an eligible world rectangle from one handle while preserving finite minimum dimensions.

### Signatures

- `(item: T, handle: GridResizeHandle, delta: GridPoint, options?: GridResizeOptions) => T`
  - delta: `GridPoint`
  - handle: `GridResizeHandle`
  - item: `T`
  - options: `GridResizeOptions` (optional)
  - returns: `T`

## resolveWorldSnapCandidate

Kind: `function`
Module: `src/features/interactions/resolveWorldSnapCandidate.ts`
Source: `src/features/interactions/resolveWorldSnapCandidate.ts:5:1`

Resolve one coordinate to the highest-priority in-tolerance candidate, then scalar snapping.

### Signatures

- `(value: number, candidates: readonly GridSnapCandidate[], options: GridCandidateSnapOptions) => number`
  - candidates: `readonly GridSnapCandidate[]`
  - options: `GridCandidateSnapOptions`
  - value: `number`
  - returns: `number`

## revealWorldRect

Kind: `function`
Module: `src/features/viewport/revealWorldRect.ts`
Source: `src/features/viewport/revealWorldRect.ts:8:1`

Minimally pans a viewport so that a world rectangle is visible inside pixel padding.
Oversized rectangles align their leading edges because neither axis can show them in full.

### Signatures

- `(viewport: GridViewport, rect: GridRect, paddingPixels?: number, constraints?: GridViewportConstraints | undefined) => GridViewport`
  - constraints: `GridViewportConstraints | undefined` (optional)
  - paddingPixels: `number` (optional)
  - rect: `GridRect`
  - viewport: `GridViewport`
  - returns: `GridViewport`

## selectWorldRects

Kind: `function`
Module: `src/features/interactions/selectWorldRects.ts`
Source: `src/features/interactions/selectWorldRects.ts:9:1`

Select input-order item IDs by normalized marquee containment or intersection.

### Signatures

- `(items: readonly T[], marquee: GridRect, options: GridMarqueeSelectionOptions) => readonly string[]`
  - items: `readonly T[]`
  - marquee: `GridRect`
  - options: `GridMarqueeSelectionOptions`
  - returns: `readonly string[]`

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
Source: `src/features/viewport/viewportToWorld.ts:5:1`

Transform a viewport pixel coordinate back into world space.

### Signatures

- `(point: GridPoint, viewport: GridViewport) => GridPoint`
  - point: `GridPoint`
  - viewport: `GridViewport`
  - returns: `GridPoint`

## worldToViewport

Kind: `function`
Module: `src/features/viewport/worldToViewport.ts`
Source: `src/features/viewport/worldToViewport.ts:5:1`

Transform stable world coordinates to screen pixels.

### Signatures

- `(point: GridPoint, viewport: GridViewport) => GridPoint`
  - point: `GridPoint`
  - viewport: `GridViewport`
  - returns: `GridPoint`

## zoomViewportAt

Kind: `function`
Module: `src/features/viewport/zoomViewportAt.ts`
Source: `src/features/viewport/zoomViewportAt.ts:11:1`

Zoom around a fixed pixel focal point without moving its underlying world coordinate.

### Signatures

- `(viewport: GridViewport, focalPoint: GridPoint, nextScale: Pick<GridViewport, "pixelsPerUnitX" | "pixelsPerUnitY">, limits?: GridZoomLimits, constraints?: GridViewportConstraints | undefined) => GridViewport`
  - constraints: `GridViewportConstraints | undefined` (optional)
  - focalPoint: `GridPoint`
  - limits: `GridZoomLimits` (optional)
  - nextScale: `Pick<GridViewport, "pixelsPerUnitX" | "pixelsPerUnitY">`
  - viewport: `GridViewport`
  - returns: `GridViewport`
