import { PortChildProps } from 'reaflow';

/**
 *
 */
export type AdditionalPortChildProps = {
  isReachable: boolean;
}

/**
 *
 */
export type BasePortChildProps = PortChildProps & AdditionalPortChildProps;

export default BasePortChildProps;
