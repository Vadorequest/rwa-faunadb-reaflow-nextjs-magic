import { NodeData } from 'reaflow';
import BaseNodeAdditionalData from './BaseNodeAdditionalData';

/**
 * Partial shape of any node.
 *
 * Used when expecting only part of a node's properties. (e.g: patch)
 */
export type PartialBaseNodeData<AdditionalData extends Partial<BaseNodeAdditionalData> = Partial<BaseNodeAdditionalData>> = Partial<NodeData<AdditionalData>>;

export default PartialBaseNodeData;
