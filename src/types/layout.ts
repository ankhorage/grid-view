/** A discrete matrix axis entry with a stable identity and world-unit extent. */
export interface GridMatrixAxisEntry {
  readonly id: string;
  readonly size: number;
}

/** Sparse matrix topology expressed through stable row and column identities. */
export interface GridMatrixCell {
  readonly id: string;
  readonly rowId: string;
  readonly columnId: string;
}

/** Matrix topology and geometry inputs, independent of any presentation layer. */
export interface GridMatrixLayout {
  readonly rows: readonly GridMatrixAxisEntry[];
  readonly columns: readonly GridMatrixAxisEntry[];
}

/** Internal indexed world geometry for a validated ordered layout axis. */
export interface GridAxisMetrics {
  readonly indexes: ReadonlyMap<string, number>;
  readonly offsets: readonly number[];
  readonly sizes: readonly number[];
}

/** A sparse cell together with its resolved world-space rectangle and indexes. */
export interface GridMatrixCellPlacement extends GridMatrixCell {
  readonly rowIndex: number;
  readonly columnIndex: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/** An ordered lane with a stable identity and world-unit height. */
export interface GridLane {
  readonly id: string;
  readonly height: number;
}

/** An interval supplied in world coordinates by a domain-specific adapter. */
export interface GridLaneInterval {
  readonly id: string;
  readonly laneId: string;
  readonly start: number;
  readonly extent: number;
}

/** A lane interval together with its resolved world-space rectangle and lane index. */
export interface GridLaneIntervalPlacement extends GridLaneInterval {
  readonly laneIndex: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}
