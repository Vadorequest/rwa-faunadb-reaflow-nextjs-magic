import BasePortData from './BasePortData';
import NodeType from './NodeType';

/**
 * Default node properties shared by all nodes, no matter what type they are.
 *
 * Can use the same properties as "BaseNodeData".
 */
export type BaseNodeDefaultProps = {
  type: NodeType;
  baseWidth: number;
  baseHeight: number;
  ports: BasePortData[];
}
