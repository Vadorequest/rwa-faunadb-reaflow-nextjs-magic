import { EdgeData } from 'reaflow/dist/types';
import BaseEdgeAdditionalData from './BaseEdgeAdditionalData';

/**
 * Shape of any edge.
 *
 * Extends the Reaflow.EdgeData and add additional data to its "data" property.
 */
export type BaseEdgeData = EdgeData<Required<BaseEdgeAdditionalData>>;

export default BaseEdgeData;
