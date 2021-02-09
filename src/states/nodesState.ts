import { atom } from 'recoil';
import BaseNodeData from '../types/BaseNodeData';
import {
  createNodeFromDefaultProps,
  getDefaultNodePropsWithFallback,
} from '../utils/nodes';

const initialNodes: BaseNodeData[] = [
  createNodeFromDefaultProps(getDefaultNodePropsWithFallback('information')),
];

export const nodesState = atom<BaseNodeData[]>({
  key: 'nodesState',
  default: initialNodes,
});
