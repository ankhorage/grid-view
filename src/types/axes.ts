import type { GridViewport } from './grid.js';

/** Axis kinds express domain structure, not rendering technology. */
export type GridAxisKind = 'continuous' | 'discrete' | 'categorical';
export type GridAxisName = 'x' | 'y';

/** A category occupies a numerical interval in the generic world. */
export interface GridAxisCategory {
  readonly id: string;
  readonly start: number;
  readonly size: number;
}

/** A domain adapter maps its values into the generic numeric axis. */
export interface GridAxisDefinition {
  readonly kind: GridAxisKind;
  readonly origin?: number;
  readonly categories?: readonly GridAxisCategory[];
}

/** Generic ruler/tick geometry; domain-specific labels may be supplied externally. */
export interface GridAxisTick {
  readonly position: number;
  readonly level: 'major' | 'minor';
  readonly label?: string;
}

export type GridTickSpecification =
  | {
      readonly mode: 'fixed';
      readonly step: number;
      readonly origin?: number;
      readonly majorEvery?: number;
      readonly overscanPixels?: number;
      readonly maxTicks?: number;
    }
  | {
      readonly mode: 'adaptive';
      readonly origin?: number;
      readonly minPixelSpacing?: number;
      readonly majorEvery?: number;
      readonly overscanPixels?: number;
      readonly maxTicks?: number;
    };

/** Executable tick providers are code APIs, never manifest fields. */
export interface GridTickContext {
  readonly viewport: GridViewport;
  readonly axis: GridAxisName;
  readonly start: number;
  readonly end: number;
  readonly pixelsPerUnit: number;
}

export type GridTickProvider = (context: GridTickContext) => readonly GridAxisTick[];
