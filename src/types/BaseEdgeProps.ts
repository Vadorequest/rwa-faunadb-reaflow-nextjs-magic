import { EdgeProps } from 'reaflow';

/**
 * Props received by any edge component (BaseEdge).
 *
 * Doesn't do anything particular at the moment, used in case we'd need to extend it later on.
 */
export type BaseEdgeProps = {} & Partial<EdgeProps>;

export default BaseEdgeProps;
