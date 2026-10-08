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
