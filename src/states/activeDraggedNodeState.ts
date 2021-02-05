import { atom } from 'recoil';
import BaseNodeData from '../types/BaseNodeData';

/**
 * Used to know which node is being dragged by the user, so that we can display a "dragging preview" and link it to the enteredNode when drag ends
 */
export const activeDraggedNodeState = atom<BaseNodeData | undefined>({
  key: 'activeDraggedNodeState',
  default: undefined,
});
