/*** Read an indexed axis metric while preserving the invariant that validated indexes exist. */
export function readGridAxisMetric(values: readonly number[], index: number): number {
  const value = values.at(index);
  if (value === undefined) {
    throw new RangeError('Layout axis metric indexes must reference an existing entry.');
  }
  return value;
}
