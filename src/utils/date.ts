import now from 'lodash.now';

/**
 * Whether a timestamp is younger than the provided age.
 *
 * @param timestamp
 * @param age
 */
export const isYoungerThan = (timestamp?: number, age: number = 1000): boolean => {
  return ((timestamp || 0) + age > now())
}
