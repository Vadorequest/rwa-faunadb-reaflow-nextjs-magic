import { Subscription } from 'faunadb/src/types/Stream';
import { CanvasDataset } from '../CanvasDataset';
import { FaunaError } from './FaunaError';
import { TypeOfRef } from './TypeOfRef';

export type OnStreamStart = (stream: Subscription, canvasRef: TypeOfRef, at: number) => void;
export type OnStreamInit = (canvasDataset: CanvasDataset) => void;
export type OnStreamedDocumentUpdate = (canvasDatasetRemotelyUpdated: CanvasDataset) => void;
export type OnStreamError = (error: FaunaError, restartStream: () => void) => void;
