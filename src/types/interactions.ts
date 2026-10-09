import type { GridRectItem } from './items.js';
import type { GridSnapResolver, GridSnapSpecification } from './snap.js';

/** A rectangular item with interaction policy controlled by its caller. */
export interface GridInteractionRectItem extends GridRectItem {
  readonly disabled?: boolean;
  readonly locked?: boolean;
  readonly resizable?: boolean;
}

/** The relationship a marquee must have to an item in order to select it. */
export type GridMarqueeSelectionMode = 'contain' | 'intersect';

/** Selection policy for disabled rectangular items. */
export interface GridMarqueeSelectionOptions {
  readonly mode: GridMarqueeSelectionMode;
  readonly includeDisabled?: boolean;
}

/** A policy controlling whether a move may include protected items. */
export interface GridMoveOptions {
  readonly includeDisabled?: boolean;
  readonly includeLocked?: boolean;
}

/** Resize handles use physical world-rectangle edges, independent of drag direction. */
export type GridResizeHandle =
  'top' | 'top-right' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'left' | 'top-left';

/** Minimum dimensions and protection policy for a rectangular resize. */
export interface GridResizeOptions {
  readonly includeDisabled?: boolean;
  readonly includeLocked?: boolean;
  readonly minimumHeight?: number;
  readonly minimumWidth?: number;
}

/** Candidate categories are domain-neutral, while their priorities remain caller-controlled. */
export type GridSnapCandidateKind = 'edge' | 'grid' | 'guide' | 'marker' | 'playhead';

/** A finite world coordinate offered by an item edge, guide, marker, playhead, or grid. */
export interface GridSnapCandidate {
  readonly coordinate: number;
  readonly kind: GridSnapCandidateKind;
}

/** Candidate snap policy for one axis, including the screen tolerance projected into world units. */
export interface GridCandidateSnapOptions {
  readonly enabled?: boolean;
  readonly pixelsPerUnit: number;
  readonly priorities: readonly GridSnapCandidateKind[];
  readonly scalarResolver?: GridSnapResolver;
  readonly scalarSpecification?: GridSnapSpecification;
  readonly tolerancePixels: number;
}
