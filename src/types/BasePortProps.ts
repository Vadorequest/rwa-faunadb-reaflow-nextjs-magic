import { PortProps } from 'reaflow';

/**
 * Props received by any port component (BasePort).
 *
 * Doesn't do anything particular at the moment, used in case we'd need to extend it later on.
 */
export type BasePortProps = {} & Partial<PortProps>;

export default BasePortProps;
