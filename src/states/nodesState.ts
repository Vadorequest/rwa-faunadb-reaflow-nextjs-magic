import { atom } from 'recoil';
import BaseNodeData from '../types/BaseNodeData';

export const nodesState = atom<BaseNodeData[]>({
  key: 'nodesState',
  default: [],
});
