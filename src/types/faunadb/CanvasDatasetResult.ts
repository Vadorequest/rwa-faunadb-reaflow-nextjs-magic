import * as Fauna from 'faunadb/src/types/values';
import { Canvas } from './Canvas';

export type CanvasDatasetResult = Fauna.values.Document<Canvas['data']>;
