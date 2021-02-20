import { v1 as uuid } from 'uuid';
import { PortSide } from '../../../unlyEd/reaflow/src';
import BaseNodeData from '../types/BaseNodeData'; // XXX Use v1 for uniqueness - See https://www.sohamkamani.com/blog/2016/10/05/uuid1-vs-uuid4/
import BasePortData from '../types/BasePortData';

/**
 * Creates a new port and returns it.
 *
 * @param portData
 */
export const createPort = (portData?: Partial<BasePortData>): BasePortData => {
  let { id = uuid() } = portData || {};

  const newPort = {
    ...portData,
    id,
  };
  console.log('newPort', newPort);

  return newPort as BasePortData;
};

/**
 * Resolve default fromPort, based on the existing ports attached to the node.
 *
 * @param fromNode
 * @param fromPort
 */
export const getDefaultFromPort = (fromNode?: BaseNodeData, fromPort?: Partial<BasePortData>): Partial<BasePortData> | undefined => {
  fromPort = fromPort || fromNode?.ports?.find((port: BasePortData) => port?.side === 'EAST');

  return fromPort;
};

/**
 * Resolve default toPort, based on the existing ports attached to the node.
 *
 * @param toNode
 * @param toPort
 */
export const getDefaultToPort = (toNode?: BaseNodeData, toPort?: Partial<BasePortData>): Partial<BasePortData> | undefined => {
  toPort = toPort || toNode?.ports?.find((port: BasePortData) => port?.side === 'WEST');

  return toPort;
};

/**
 * Whether a port should be highlighted.
 *
 * Should highlight when:
 * - The destination node is different. (don't allow recursive link to itself)
 * - The port source is on EAST side. (don't allow to go from right to left)
 * - The destination port's side is not the same as the source port's side. (forces left to right workflow)
 * - TODO There isn't already a connection to the destination port. (avoids duplicated edges)
 *
 * @param fromNode
 * @param fromPort
 * @param currentNodeId
 * @param fromSide
 */
export const shouldBeHighlighted = (fromNode?: BaseNodeData, fromPort?: BasePortData, currentNodeId?: string, fromSide?: PortSide): boolean => {
  const areSourceAndDestinationPortsDifferent = fromNode?.id !== currentNodeId;
  const arePortsOnDifferentSides = fromPort?.side !== fromSide;
  const isSourcePortFromEastSide = fromPort?.side === 'EAST';

  return !!(fromPort && areSourceAndDestinationPortsDifferent && arePortsOnDifferentSides && isSourcePortFromEastSide);
};
