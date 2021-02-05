import { atom } from 'recoil';
import BaseNodeData from '../types/BaseNodeData';

/**
 * Used to know which node is currently being entered by a dragged block, so that when the user ends the drag we can link the activeDraggedNode to it
 */
export const currentDraggedNodeTargetState = atom<BaseNodeData | undefined>({
  key: 'currentDraggedNodeTargetState', // currentDraggedNodeTargetState
  default: undefined,
});
