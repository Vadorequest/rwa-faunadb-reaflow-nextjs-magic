import { FunctionComponent } from 'react';
import BaseNodeProps from './BaseNodeProps';
import { GenericObject } from './GenericObject';
import { GetBaseNodeDefaultProps } from './GetBaseNodeDefaultProps';

/**
 * React Block functional component.
 * Used by all node components.
 */
export type BaseNodeComponent<Props extends GenericObject = BaseNodeProps> = FunctionComponent<Props> & {
  getDefaultNodeProps: GetBaseNodeDefaultProps;
}

export default BaseNodeComponent;
