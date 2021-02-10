import { FunctionComponent } from 'react';
import BaseNodeProps from './BaseNodeProps';
import { GenericObject } from './GenericObject';

/**
 * Used by all "Block" components.
 */
export type BaseBlockComponent<Props extends GenericObject = BaseNodeProps> = FunctionComponent<Props> & {}

export default BaseBlockComponent;
