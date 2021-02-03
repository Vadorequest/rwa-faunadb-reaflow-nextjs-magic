import { FunctionComponent } from 'react';
import BaseBlockProps from './BaseBlockProps';
import { GenericObject } from './GenericObject';
import { GetBaseBlockDefaultProps } from './GetBaseBlockDefaultProps';

/**
 * React Block functional component.
 * Used by all block components.
 */
export type BaseBlockComponent<Props extends GenericObject = BaseBlockProps> = FunctionComponent<Props> & {
  getDefaultNodeProps: GetBaseBlockDefaultProps;
}

export default BaseBlockComponent;
