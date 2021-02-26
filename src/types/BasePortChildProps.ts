import { PortChildProps } from 'reaflow';
import BaseNodeData from './BaseNodeData';

/**
 * Additional properties that will be passed down to the PortChildComponent component.
 */
export type AdditionalPortChildProps = {
  fromNode: BaseNodeData;
  isNodeReachable: boolean;
}

/**
 * Base port child properties provided to any instance of the PortChildComponent component.
 *
 * It inherits from Reaflow "PortChildProps" and add other custom properties on top of them.
 */
export type BasePortChildProps = PortChildProps & AdditionalPortChildProps;

export default BasePortChildProps;
