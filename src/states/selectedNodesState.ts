import { atom } from 'recoil';
import BaseNodeData from '../types/BaseNodeData';

/**
 * Used to know which nodes are being selected by the user.
 *
 * Can be a single node, several nodes, or none of them.
 *
 * XXX Might be replaced by the built-in Reaflow "selection" utility - See https://reaflow.dev/?path=/story/docs-helpers-selection--page
 */
export const selectedNodesState = atom<BaseNodeData[]>({
  key: 'selectedNodesState',
  default: [],
});
