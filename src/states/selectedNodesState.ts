import { atom } from 'recoil';

/**
 * Used to know which nodes (ids) are being selected by the user.
 *
 * Can be a single node, several nodes, or none of them.
 */
export const selectedNodesState = atom<string[]>({
  key: 'selectedNodesState',
  default: [],
});
