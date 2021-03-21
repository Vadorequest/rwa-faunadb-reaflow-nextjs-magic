import { NodeData } from 'reaflow';
import BaseNodeAdditionalData from './BaseNodeAdditionalData';

/**
 * Shape of any node.
 *
 * Extends the Reaflow.NodeData and add additional data to its "data" property.
 */
export type BaseNodeData<AdditionalData extends BaseNodeAdditionalData = BaseNodeAdditionalData> = NodeData<AdditionalData>;

export default BaseNodeData;
