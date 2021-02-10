import { atom } from 'recoil';
import BaseNodeData from '../types/BaseNodeData';

/**
 * Used to know which node was created last.
 */
export const lastCreatedNodeState = atom<BaseNodeData | undefined>({
  key: 'lastCreatedNodeState',
  default: undefined,
});
