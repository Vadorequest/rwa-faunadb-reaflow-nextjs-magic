import { MutableRefObject } from 'react';
import { CanvasRef } from 'reaflow';
import { atom } from 'recoil';

/**
 *
 */
export const canvasRefState = atom<MutableRefObject<CanvasRef> | null>({
  key: 'canvasRefState',
  default: null,
});
