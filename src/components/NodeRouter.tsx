import React from 'react';
import {
  Node,
  NodeData,
  NodeProps,
} from 'reaflow';
import BaseBlockData from '../types/BaseBlockData';
import BaseBlockType from '../types/BaseBlockType';
import InformationBlock from './blocks/InformationBlock';
import QuestionBlock from './blocks/QuestionBlock';

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
  const { type }: { type: BaseBlockType } = data || {};

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
    onEnter: (event: MouseEvent, node: BaseBlockData) => setEnteredNode(node),
    onLeave: (event: MouseEvent, node: BaseBlockData) => setEnteredNode(undefined)
  };

  // console.log('rendering block of type: ', type, commonBlockProps)

  switch (type) {
    case 'information':
      return (
        <InformationBlock
          isPreview={false}
          {...commonBlockProps}
        />
      );
    case 'question':
      return (
        <QuestionBlock
          isPreview={false}
          {...commonBlockProps}
        />
      );
  }

  return null;
};

export default NodeRouter;
