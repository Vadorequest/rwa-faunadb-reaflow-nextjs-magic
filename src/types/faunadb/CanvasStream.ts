import { values } from 'faunadb';
import { Subscription } from 'faunadb/src/types/Stream';
import { CanvasDataset } from '../CanvasDataset';

type Ref = values.Ref;

export type OnStart = (stream: Subscription, canvasRef: Ref) => void;
export type OnInit = (canvasDataset: CanvasDataset) => void;
export type OnUpdate = (canvasDatasetRemotelyUpdated: CanvasDataset) => void;
