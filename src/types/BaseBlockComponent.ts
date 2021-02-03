import { FunctionComponent } from 'react';
import BaseBlockProps from './BaseBlockProps';
import BaseBlockType from './BaseBlockType';
import { GenericObject } from './GenericObject';

/**
 * React Block functional component.
 * Used by all block components.
 */
export type BaseBlockComponent<Props extends GenericObject = BaseBlockProps> = FunctionComponent<Props> & {
  previewText: string;
  type: BaseBlockType;
}

export default BaseBlockComponent;
