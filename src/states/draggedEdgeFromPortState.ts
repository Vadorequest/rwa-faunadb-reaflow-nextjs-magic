import { Position } from 'reaflow/dist/utils/useNodeDrag';
import { atom } from 'recoil';
import BaseNodeData from '../types/BaseNodeData';
import BasePortData from '../types/BasePortData';

export type DraggedEdgeFromPort = {
  fromNode: BaseNodeData;
  fromPort: BasePortData;
  fromPosition: Position;
}

/**
 * Used to know from which node/port the current edge is being dragged from.
 */
export const draggedEdgeFromPortState = atom<DraggedEdgeFromPort | undefined>({
  key: 'draggedEdgeFromPortState',
  default: undefined,
});
