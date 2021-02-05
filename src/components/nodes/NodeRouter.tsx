import classnames from 'classnames';
import React from 'react';
import { NodeProps } from 'reaflow';
import { useRecoilState } from 'recoil';
import { isDraggedNodeCloseState } from '../../states/isDraggedNodeCloseState';
import { isDraggedNodeDroppableState } from '../../states/isDraggedNodeDroppableState';
import { lastFocusedNodeState } from '../../states/lastFocusedNodeState';
import { selectedNodesState } from '../../states/selectedNodesState';
import BaseNodeData from '../../types/BaseNodeData';
import BaseNodeProps from '../../types/BaseNodeProps';
import BaseNodeType from '../../types/BaseNodeType';
import InformationNode from './InformationNode';
import QuestionNode from './QuestionNode';

type Props = {
  node: NodeProps;
  updateCurrentNode: (nodeData: Partial<BaseNodeData>) => void;
}

const NodeRouter: React.FunctionComponent<Props> = (props) => {
  const {
    node,
    updateCurrentNode,
  } = props;
  const [lastFocusedNode, setLastFocusedNode] = useRecoilState(lastFocusedNodeState);
  const [isDroppable, setDroppable] = useRecoilState(isDraggedNodeDroppableState);
  const [isDraggedNodeClose, setIsDraggedNodeClose] = useRecoilState(isDraggedNodeCloseState);
  const [selectedNodes, setSelectedNodes] = useRecoilState(selectedNodesState);

  console.log('router nodes', props);

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
  const strokeWidth = lastFocusedNode?.id === node.id && isDroppable && isDraggedNodeClose ? 10 : defaultStrokeWidth;

  const commonBlockProps: Partial<BaseNodeProps> = {
    ...node,
    updateCurrentNode,
    className: classnames({ 'dnd-closest': lastFocusedNode?.id === node.id }, `node node-${type}`),
    style: {
      strokeWidth: strokeWidth,
      fill: 'white',
      color: 'black',
    },
    onClick: () => {

      console.log(`node clicked (${node?.properties?.text || node?.id})`, node)
      // setSelectedNodes([node]);
    },
    onEnter: (event: React.MouseEvent<SVGGElement, MouseEvent>, node: BaseNodeData) => {
      if (node?.id !== lastFocusedNode?.id) {
        setLastFocusedNode(node);
        console.log('setLastFocusedNode', node);
      }
    },
    onLeave: (event: React.MouseEvent<SVGGElement, MouseEvent>, node: BaseNodeData) => {
      if (lastFocusedNode?.id === node?.id) {
        setLastFocusedNode(undefined);
        console.log('setLastFocusedNode', undefined);
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
