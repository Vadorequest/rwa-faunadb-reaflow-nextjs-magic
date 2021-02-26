import { PortChildProps } from 'reaflow';

/**
 * Additional properties that will be passed down to the PortChildComponent component.
 */
export type AdditionalPortChildProps = {
  isReachable: boolean;
}

/**
 * Base port child properties provided to any instance of the PortChildComponent component.
 *
 * It inherits from Reaflow "PortChildProps" and add other custom properties on top of them.
 */
export type BasePortChildProps = PortChildProps & AdditionalPortChildProps;

export default BasePortChildProps;
