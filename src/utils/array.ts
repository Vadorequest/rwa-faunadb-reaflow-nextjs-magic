/**
 * Detects whether an array has duplicated objects.
 *
 * @param array
 * @param key
 */
export const hasDuplicatedObjects = <T>(array: T[], key: keyof T): boolean => {
  const _array = array.map((element: T) => element[key]);

  return new Set(_array).size !== _array.length;
};
