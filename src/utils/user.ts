import capitalize from 'lodash.capitalize';
import kebabCase from 'lodash.kebabcase';

/**
 * Humanizes the email by taking only the first part before any special char (which is usually the firstname).
 *
 * @param email
 */
export const humanizeEmail = (email: string) => {
  return capitalize(kebabCase(email || '')?.split('-')?.[0]);
};
