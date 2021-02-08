import { atom } from 'recoil';
import BaseEdgeData from '../types/BaseEdgeData';

const initialEdges: BaseEdgeData[] = [];

export const edgesState = atom<BaseEdgeData[]>({
  key: 'edgesState',
  default: initialEdges,
});
