import classnames from 'classnames';
import React from 'react';
import {
  NodeData,
  NodeProps,
} from 'reaflow';
import BaseNodeData from '../types/BaseNodeData';
import BaseNodeType from '../types/BaseNodeType';
import InformationNode from './nodes/InformationNode';
import QuestionNode from './nodes/QuestionNode';

type Props = {
  node: NodeProps;
  updateCurrentNode: (nodeData: Partial<BaseNodeData>) => void;
  isDroppable: boolean;
  isDraggedNodeClose: boolean;
  enteredNode: BaseNodeData | undefined;
  setEnteredNode: (node: NodeData | undefined) => void;
}

const NodeRouter: React.FunctionComponent<Props> = (props) => {
  const {
    node,
    updateCurrentNode,
    isDroppable,
    isDraggedNodeClose,
    enteredNode: previouslyEnteredNode,
    setEnteredNode,
  } = props;
  console.log('router nodes', props)

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

  const defaultStrokeWidth = 0;
  const strokeWidth = previouslyEnteredNode?.id === node.id && isDroppable && isDraggedNodeClose ? 10 : defaultStrokeWidth;

  const commonBlockProps = {
    ...node,
    updateCurrentNode,
    className: classnames({ 'dnd-closest': previouslyEnteredNode?.id === node.id }, `node node-${type}`),
    style: {
      strokeWidth: strokeWidth,
      fill: 'white',
      color: 'black',
    },
    onClick: () => console.log(`node clicked (${node?.properties?.text || node?.id})`, node),
    onEnter: (event: MouseEvent, node: BaseNodeData) => {
      if (node?.id !== previouslyEnteredNode?.id) {
        setEnteredNode(node);
        console.log('setEnteredNode', node);
      }
    },
    onLeave: (event: MouseEvent, node: BaseNodeData) => {
      if (previouslyEnteredNode !== undefined) {
        setEnteredNode(undefined);
        console.log('setEnteredNode', undefined);
      }
    },
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
