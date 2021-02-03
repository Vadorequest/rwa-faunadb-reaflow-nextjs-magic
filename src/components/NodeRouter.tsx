import React from 'react';
import {
  Node,
  NodeData,
  NodeProps,
} from 'reaflow';
import BaseNodeData from '../types/BaseNodeData';
import BaseNodeType from '../types/BaseNodeType';
import InformationNode from './nodes/InformationNode';
import QuestionNode from './nodes/QuestionNode';

type Props = {
  node: NodeProps;
  setEnteredNode: (node: NodeData | undefined) => void;
}

const NodeRouter: React.FunctionComponent<Props> = (props) => {
  const {
    node,
    setEnteredNode,
  } = props;

  const { properties } = node || {};
  const { data } = properties || {};
  const { type }: { type: BaseNodeType } = data || {};

  if (!type) {
    try {
      console.error(`Node with type="${type}" couldn't be rendered. Properties: ${JSON.stringify(properties, null, 2)}`);
    } catch (e) {
      console.error(`Node with type="${type}" couldn't be rendered. Properties cannot be stringified.`);
    }

    return null;
  }

  const commonBlockProps = {
    ...node,
    className: `node node-${type}`,
    onClick: () => console.log(`node clicked (${node?.properties?.text || node?.id})`, node),
    onEnter: (event: MouseEvent, node: BaseNodeData) => setEnteredNode(node),
    onLeave: (event: MouseEvent, node: BaseNodeData) => setEnteredNode(undefined)
  };

  // console.log('rendering node of type: ', type, commonBlockProps)

  switch (type) {
    case 'information':
      return (
        <InformationNode
          {...commonBlockProps}
        />
      );
    case 'question':
      return (
        <QuestionNode
          {...commonBlockProps}
        />
      );
  }

  return null;
};

export default NodeRouter;
