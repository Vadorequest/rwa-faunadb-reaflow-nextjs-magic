import { atom } from 'recoil';

/**
 * Used to know whether the dragged node is close to another node
 */
export const isDraggedNodeCloseState = atom<boolean>({
  key: 'isDraggedNodeCloseState',
  default: false,
});


