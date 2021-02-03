import { v1 as uuid } from 'uuid'; // XXX Use v1 for uniqueness - See https://www.sohamkamani.com/blog/2016/10/05/uuid1-vs-uuid4/
import BaseBlockData from '../types/BaseBlockData';

/**
 * Creates a new node and returns it.
 *
 * @param nodeData
 */
export const createNode = (nodeData?: Partial<BaseBlockData>): BaseBlockData => {
  let { id = uuid() } = nodeData || {};

  const newNode = {
    ...nodeData,
    id,
  };
  console.log('newNode', newNode);

  return newNode;
};
