import { NodeData } from 'reaflow';
import BaseBlockAdditionalData from './BaseBlockAdditionalData';

/**
 * Shape of any block.
 * Extends the Reaflow.NodeData and add additional data to its "data" property.
 */
export type BaseBlockData = NodeData<BaseBlockAdditionalData>;

export default BaseBlockData;
