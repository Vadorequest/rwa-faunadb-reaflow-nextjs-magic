import { v1 as uuid } from 'uuid'; // XXX Use v1 for uniqueness - See https://www.sohamkamani.com/blog/2016/10/05/uuid1-vs-uuid4/
import BaseNodeData from '../types/BaseNodeData';
import { BaseNodeDefaultProps } from '../types/BaseNodeDefaultProps';

/**
 * Creates a new node and returns it.
 *
 * @param nodeData
 */
export const createNode = (nodeData?: Partial<BaseNodeData>): BaseNodeData => {
  let { id = uuid() } = nodeData || {};

  const newNode = {
    ...nodeData,
    id,
  };
  console.log('newNode', newNode);

  return newNode;
};

/**
 * Creates a new node from the default props and returns it.
 *
 *
 * @param defaultProps
 */
export const createNodeFromDefaultProps = (defaultProps: BaseNodeDefaultProps): BaseNodeData => {
  console.log('createNodeFromDefaultProps', defaultProps);
  const node = {
    text: defaultProps.previewText,
    width: defaultProps.minWidth,
    height: defaultProps.minHeight,
    data: {
      type: defaultProps.type,
    },
  };

  return createNode(node);
};
