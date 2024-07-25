export function arrayEquals<T>(
  a: ReadonlyArray<T>,
  b: ReadonlyArray<T>
): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function containsAny<T>(
  haystack: ReadonlyArray<T>,
  needles: ReadonlyArray<T>
): boolean {
  return haystack.some((h) => needles.includes(h));
}

export function union(
  ...lists: ReadonlyArray<ReadonlyArray<number>>
): ReadonlyArray<number> {
  return [...new Set(lists.flatMap((l) => l))].toSorted();
}

export function intersection(
  ...lists: ReadonlyArray<ReadonlyArray<number>>
): ReadonlyArray<number> {
  if (lists.length === 0) return [];
  return lists.reduce((acc, list) => acc.filter((n) => list.includes(n)));
}
