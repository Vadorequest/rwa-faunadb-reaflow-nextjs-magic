import { atom } from 'recoil';
import BaseEdgeData from '../types/BaseEdgeData';

const initialEdges: BaseEdgeData[] = [];

/**
 * Used to know what are the edges currently displayed within the Canvas component.
 */
export const edgesState = atom<BaseEdgeData[]>({
  key: 'edgesState',
  default: initialEdges,
});
