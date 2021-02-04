import { atom } from 'recoil';

/**
 * Used to determine if we can drop the element (onto the canvas)
 */
export const isDraggedNodeDroppableState = atom<boolean>({
  key: 'isDraggedNodeDroppableState',
  default: false,
});


