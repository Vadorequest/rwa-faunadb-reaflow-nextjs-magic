import { atom } from 'recoil';
import BaseNodeData from '../types/BaseNodeData';

/**
 * Used to know which node has been last entered/focused, so that when the user ends the drag we can link the activeDraggedNode to it
 */
export const lastFocusedNodeState = atom<BaseNodeData | undefined>({
  key: 'lastFocusedNodeState',
  default: undefined,
});


