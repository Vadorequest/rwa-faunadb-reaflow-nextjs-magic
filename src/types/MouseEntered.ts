import BaseNodeData from './BaseNodeData';
import BasePortData from './BasePortData';

/**
 * Contains the currently entered node and port.
 */
export type MouseEntered = {
  enteredNode?: BaseNodeData;
  enteredPort?: BasePortData;
};
