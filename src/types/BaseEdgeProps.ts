import { EdgeProps } from 'reaflow';
import BaseEdgeData from './BaseEdgeData';
import { QueueCanvasDatasetMutation } from './CanvasDatasetMutation';

export type PatchCurrentEdge<EdgeData extends Partial<BaseEdgeData> = Partial<BaseEdgeData>> = (patch: Partial<EdgeData>) => void;

/**
 * Props received by any edge component (BaseEdge).
 *
 * Doesn't do anything particular at the moment, used in case we'd need to extend it later on.
 */
export type BaseEdgeProps = Partial<EdgeProps> & {
  queueCanvasDatasetMutation: QueueCanvasDatasetMutation;
};

export default BaseEdgeProps;
