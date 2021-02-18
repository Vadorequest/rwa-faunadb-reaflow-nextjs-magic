import { atom } from 'recoil';

/**
 * Used to know which nodes/edges ids are being selected by the user.
 *
 * Can be a single node/edges, several nodes/edges, or none of them.
 */
export const selectedState = atom<string[]>({
  key: 'selectedState',
  default: [],
});
