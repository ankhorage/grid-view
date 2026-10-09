/** World coordinates are independent of pixel density and zoom. */
export interface GridPoint {
  readonly x: number;
  readonly y: number;
}

/** A world-aligned rectangle. */
export interface GridRect extends GridPoint {
  readonly width: number;
  readonly height: number;
}

/** The world coordinate at the top-left viewport corner and axis scales in px/world-unit. */
export interface GridViewport {
  readonly width: number;
  readonly height: number;
  readonly offsetX: number;
  readonly offsetY: number;
  readonly pixelsPerUnitX: number;
  readonly pixelsPerUnitY: number;
}

/** Optional independent horizontal/vertical scale constraints. */
export interface GridZoomLimits {
  readonly minX?: number;
  readonly maxX?: number;
  readonly minY?: number;
  readonly maxY?: number;
}

/** Alignment used when bounded world content is smaller than a viewport axis. */
export type GridViewportAlignment = 'start' | 'center' | 'end';

/**
 * Serializable world bounds for viewport interaction. Overscroll is expressed in world units and
 * extends the reachable offsets beyond each world edge. When the world is smaller than an axis,
 * alignment fixes its position because no offset can keep both edges inside the viewport.
 */
export interface GridViewportConstraints {
  readonly world: GridRect;
  readonly overscrollX?: number;
  readonly overscrollY?: number;
  readonly alignmentX?: GridViewportAlignment;
  readonly alignmentY?: GridViewportAlignment;
}
