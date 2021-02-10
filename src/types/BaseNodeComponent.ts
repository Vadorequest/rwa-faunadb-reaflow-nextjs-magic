import { FunctionComponent } from 'react';
import { PortData } from 'reaflow';
import BaseNodeProps from './BaseNodeProps';
import { GenericObject } from './GenericObject';
import { GetBaseNodeDefaultProps } from './GetBaseNodeDefaultProps';

/**
 * React Block functional component.
 *
 * Used by all node components (BaseNode).
 */
export type BaseNodeComponent<Props extends GenericObject = BaseNodeProps> = FunctionComponent<Props> & {
  /**
   * Function returning the default props of the node.
   *
   * Each node type might implement its own "getDefaultNodeProps".
   * Used when creating a new node.
   */
  getDefaultNodeProps?: GetBaseNodeDefaultProps;

  /**
   * Function returning the default ports of the node.
   *
   * Invoked by getDefaultNodeProps.
   */
  getDefaultPorts?: () => PortData[];
}

export default BaseNodeComponent;
