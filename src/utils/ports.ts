import { v1 as uuid } from 'uuid';
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
