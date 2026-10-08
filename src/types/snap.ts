/** Numeric world-space snapping remains independent of viewport zoom and visible ticks. */
export type GridSnapSpecification =
  | { readonly mode: 'off' }
  | { readonly mode: 'fixed'; readonly step: number; readonly origin?: number };

/** Domain-specific snap policies can be provided as code, not serialized in manifests. */
export type GridSnapResolver = (value: number) => number;
