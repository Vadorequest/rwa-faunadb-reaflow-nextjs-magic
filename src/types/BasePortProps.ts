import React from 'react';
import { PortProps } from 'reaflow';
import BasePortChildProps, { AdditionalPortChildProps } from './BasePortChildProps';
import { AddCanvasDatasetMutation } from './CanvasDatasetMutation';

/**
 * Props received by any port component (BasePort).
 *
 * Doesn't do anything particular at the moment, used in case we'd need to extend it later on.
 */
export type BasePortProps = Partial<PortProps> & {
  fromNodeId: string;
  additionalPortChildProps: AdditionalPortChildProps;
  PortChildComponent: React.FunctionComponent<BasePortChildProps>;
  addCanvasDatasetMutation: AddCanvasDatasetMutation;
};

export default BasePortProps;
