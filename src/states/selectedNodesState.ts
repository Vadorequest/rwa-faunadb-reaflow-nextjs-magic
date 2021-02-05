import { atom } from 'recoil';
import BaseNodeData from '../types/BaseNodeData';

/**
 * Used to know which nodes are being selected by the user.
 *
 * Can be a single node, several nodes, or none of them.
 */
export const selectedNodesState = atom<BaseNodeData[]>({
  key: 'selectedNodesState',
  default: [],
});
