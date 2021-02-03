import { FunctionComponent } from 'react';
import { GenericObject } from './GenericObject';

/**
 * React Block functional component.
 * Used by all block components.
 */
export type BlockComponent<Props extends GenericObject = {}> = FunctionComponent<Props> & {
  defaultName: string
}

export default BlockComponent;
