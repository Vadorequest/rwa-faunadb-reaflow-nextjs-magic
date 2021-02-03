import { FunctionComponent } from 'react';
import BlockProps from './BlockProps';
import { GenericObject } from './GenericObject';

/**
 * React Block functional component.
 * Used by all block components.
 */
export type BlockComponent<Props extends GenericObject = BlockProps> = FunctionComponent<Props> & {
  defaultName: string
}

export default BlockComponent;
