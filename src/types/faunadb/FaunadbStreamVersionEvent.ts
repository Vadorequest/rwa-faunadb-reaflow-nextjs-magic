import { CanvasDatasetResult } from './CanvasDatasetResult';

export type FaunadbStreamVersionEvent = {
  action: 'create' | 'update' | 'delete';
  document: CanvasDatasetResult;
  diff: CanvasDatasetResult;
  prev: CanvasDatasetResult;
}
