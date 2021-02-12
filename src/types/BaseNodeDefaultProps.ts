import { PortData } from 'reaflow';
import NodeType from './NodeType';

/**
 * Default node properties shared by all nodes, no matter what type they are.
 *
 * Can use the same properties as "BaseNodeData".
 */
export type BaseNodeDefaultProps = {
  type: NodeType;
  defaultWidth: number;
  defaultHeight: number;
  ports: PortData[];
}
