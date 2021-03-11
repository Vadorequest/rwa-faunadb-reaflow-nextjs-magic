import * as Fauna from 'faunadb/src/types/values';
import { CanvasDataset } from '../CanvasDataset';

export type CanvasResult = Fauna.values.Document<CanvasDataset>;
