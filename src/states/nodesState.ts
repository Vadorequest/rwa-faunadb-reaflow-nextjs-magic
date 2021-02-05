import { atom } from 'recoil';
import InformationNode from '../components/nodes/InformationNode';
import BaseNodeData from '../types/BaseNodeData';
import { createNodeFromDefaultProps } from '../utils/nodes';

const initialNodes: BaseNodeData[] = [
  createNodeFromDefaultProps(InformationNode.getDefaultNodeProps()),
];

export const nodesState = atom<BaseNodeData[]>({
  key: 'nodesState',
  default: initialNodes,
});
