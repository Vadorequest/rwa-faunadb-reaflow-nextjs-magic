import { PortData } from 'reaflow';
import NodeType from './NodeType';

/**
 * Default node properties shared by all nodes, no matter what type they are.
 */
export type BaseNodeDefaultProps = {
  type: NodeType;
  defaultWidth: number;
  defaultHeight: number;
  ports: PortData[];
}
