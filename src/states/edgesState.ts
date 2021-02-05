import { EdgeData } from 'reaflow/dist/types';
import { atom } from 'recoil';

const initialEdges: EdgeData[] = [];

export const edgesState = atom<EdgeData[]>({
  key: 'edgesState',
  default: initialEdges,
});
