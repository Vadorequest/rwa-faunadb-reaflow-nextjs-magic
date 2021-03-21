import { BaseNodeDefaultProps } from './BaseNodeDefaultProps';
import NodeType from './NodeType';

/**
 * Arguments of the GetBaseNodeDefaultProps function.
 */
export type GetBaseNodeDefaultPropsProps = {
  type: NodeType;
  defaultWidth?: number;
  defaultHeight?: number;
}

/**
 * Signature of the getDefaultNodeProps function.
 */
export type GetBaseNodeDefaultProps = (props: GetBaseNodeDefaultPropsProps) => BaseNodeDefaultProps;
