import { css } from '@emotion/react';
import { motion } from 'framer-motion';
import { AnyPointerEvent } from 'framer-motion/types/gestures/PanSession';
import React from 'react';
import { NodeData } from 'reaflow';
import { EdgeData } from 'reaflow/dist/types';
import BaseNodeComponent from '../types/BaseNodeComponent';
import BaseNodeData from '../types/BaseNodeData';
import { createNodeFromDefaultProps } from '../utils/nodes';
import InformationNode from './nodes/InformationNode';
import QuestionNode from './nodes/QuestionNode';

type Props = {
  blocksContainerWidth: string;
  nodes: NodeData[];
  setNodes: (nodes: NodeData[]) => void;
  edges: EdgeData[];
  setEdges: (edges: EdgeData[]) => void;
  onNodeDragStart: (event: AnyPointerEvent, node: BaseNodeData) => void;
}

/**
 * Container of nodes.
 *
 * Each node can be clicked on drag and dropped, and will added into the Playground.
 */
const NodesContainer: React.FunctionComponent<Props> = (props): JSX.Element | null => {
  const {
    blocksContainerWidth,
    nodes,
    setNodes,
    edges,
    setEdges,
    onNodeDragStart,
  } = props;

  const blockComponents: BaseNodeComponent[] = [
    InformationNode,
    QuestionNode,
  ];

  console.log('NodesContainer renders');

  return (
    <div
      className={'blocks-container'}
      css={css`
        width: ${blocksContainerWidth};
        background-color: lightgrey;
      `}
    >
      {
        blockComponents.map((BlockComponent: BaseNodeComponent, index: number) => {
          const newNode = createNodeFromDefaultProps(BlockComponent.getDefaultNodeProps());

          return (
            <motion.div
              key={index}
              className="node"
              onMouseDown={(event) => {
                // @ts-ignore
                return onNodeDragStart(event, newNode);
              }}
              onClick={(event) => {
                setNodes([...nodes, newNode]);
              }}
            >
              <BlockComponent
                isPreview={true}
              />
            </motion.div>
          );
        })
      }
    </div>
  );
};

export default NodesContainer;
