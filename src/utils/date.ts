import now from 'lodash.now';

/**
 * Whether a timestamp is younger than the target.
 *
 * @param timestamp
 * @param age
 * @param target
 */
export const isYoungerThan = (timestamp?: number, age: number = 1000, target: number = now()): boolean => {
  return ((timestamp || 0) + age > target);
};

/**
 * Whether a timestamp is older than the target.
 *
 * @param timestamp
 * @param age
 * @param target
 */
export const isOlderThan = (timestamp?: number, age: number = 1000, target: number = now()): boolean => {
  return ((timestamp || 0) + age < target);
};
