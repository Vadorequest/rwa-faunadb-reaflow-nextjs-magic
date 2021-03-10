import { CanvasResult } from './CanvasResult';

export type FaunadbStreamVersionEvent = {
  action: 'create' | 'update' | 'delete';
  document: CanvasResult;
  diff: CanvasResult;
  prev: CanvasResult;
}
