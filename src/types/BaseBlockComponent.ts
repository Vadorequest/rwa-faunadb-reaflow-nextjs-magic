import { FunctionComponent } from 'react';
import BaseBlockProps from './BaseBlockProps';
import { GenericObject } from './GenericObject';

/**
 * React Block functional component.
 * Used by all block components.
 */
export type BaseBlockComponent<Props extends GenericObject = BaseBlockProps> = FunctionComponent<Props> & {
  defaultName: string
}

export default BaseBlockComponent;
