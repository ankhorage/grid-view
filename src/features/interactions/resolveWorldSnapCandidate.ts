import type { GridCandidateSnapOptions, GridSnapCandidate } from '../../types/interactions.js';
import { snapWorldCoordinate } from '../snap/snapWorldCoordinate.js';

/*** Resolve one coordinate to the highest-priority in-tolerance candidate, then scalar snapping. */
export function resolveWorldSnapCandidate(
  value: number,
  candidates: readonly GridSnapCandidate[],
  options: GridCandidateSnapOptions,
): number {
  assertSnapInput(value, candidates, options);
  const fallback = options.scalarSpecification
    ? snapWorldCoordinate(value, options.scalarSpecification, options.scalarResolver)
    : value;
  if (options.enabled === false) {
    return fallback;
  }
  const tolerance = options.tolerancePixels / options.pixelsPerUnit;
  const resolved = candidates.reduce<GridSnapCandidate | undefined>((best, candidate) => {
    if (Math.abs(candidate.coordinate - value) > tolerance) {
      return best;
    }
    if (!best || hasHigherCandidateRank(candidate, best, value, options.priorities)) {
      return candidate;
    }
    return best;
  }, undefined);
  return resolved?.coordinate ?? fallback;
}

/*** Prefer explicit kind priority, then nearer distance, while preserving input order on exact ties. */
function hasHigherCandidateRank(
  candidate: GridSnapCandidate,
  best: GridSnapCandidate,
  value: number,
  priorities: readonly GridSnapCandidate['kind'][],
): boolean {
  const candidatePriority = priorities.indexOf(candidate.kind);
  const bestPriority = priorities.indexOf(best.kind);
  if (candidatePriority !== bestPriority) {
    return candidatePriority < bestPriority;
  }
  return Math.abs(candidate.coordinate - value) < Math.abs(best.coordinate - value);
}

/*** Reject ambiguous snap policies or non-finite candidate geometry before resolving. */
function assertSnapInput(
  value: number,
  candidates: readonly GridSnapCandidate[],
  options: GridCandidateSnapOptions,
): void {
  if (
    !Number.isFinite(value) ||
    !Number.isFinite(options.pixelsPerUnit) ||
    options.pixelsPerUnit <= 0 ||
    !Number.isFinite(options.tolerancePixels) ||
    options.tolerancePixels < 0
  ) {
    throw new RangeError(
      'Snap coordinate, scale, and tolerance must be finite with positive scale.',
    );
  }
  if (
    new Set(options.priorities).size !== options.priorities.length ||
    options.priorities.length === 0
  ) {
    throw new RangeError('Snap priorities must contain each candidate kind at most once.');
  }
  if (
    !candidates.every(
      (candidate) =>
        Number.isFinite(candidate.coordinate) && options.priorities.includes(candidate.kind),
    )
  ) {
    throw new RangeError('Snap candidates must be finite and use a prioritized kind.');
  }
}
