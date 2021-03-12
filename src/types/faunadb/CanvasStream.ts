import { Subscription } from 'faunadb/src/types/Stream';
import { CanvasDataset } from '../CanvasDataset';
import { TypeOfRef } from './TypeOfRef';

export type OnStart = (stream: Subscription, canvasRef: TypeOfRef, at: number) => void;
export type OnInit = (canvasDataset: CanvasDataset) => void;
export type OnUpdate = (canvasDatasetRemotelyUpdated: CanvasDataset) => void;
