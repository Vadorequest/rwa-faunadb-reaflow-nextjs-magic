import { BaseNodeDefaultProps } from './BaseNodeDefaultProps';
import BaseNodeType from './BaseNodeType';

export type GetBaseNodeDefaultPropsProps = {
  type: BaseNodeType;
  defaultWidth?: number;
  defaultHeight?: number;
}

export type GetBaseNodeDefaultProps = (props: GetBaseNodeDefaultPropsProps) => BaseNodeDefaultProps;
