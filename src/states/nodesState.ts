import { atom } from 'recoil';
import BaseNodeData from '../types/BaseNodeData';

/**
 * Used to know what are the nodes currently displayed within the Canvas component.
 */
export const nodesState = atom<BaseNodeData[]>({
  key: 'nodesState',
  default: [],
});
