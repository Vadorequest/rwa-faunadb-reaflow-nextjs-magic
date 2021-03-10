import { CanvasDataset } from '../CanvasDataset';

export type OnInit = (canvasDataset: CanvasDataset) => void;
export type OnUpdate = (canvasDatasetRemotelyUpdated: CanvasDataset) => void;
