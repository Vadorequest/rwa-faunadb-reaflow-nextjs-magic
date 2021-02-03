import { css } from '@emotion/react';
import { motion } from 'framer-motion';
import { AnyPointerEvent } from 'framer-motion/types/gestures/PanSession';
import React from 'react';
import { NodeData } from 'reaflow';
import { EdgeData } from 'reaflow/dist/types';
import BaseNodeComponent from '../types/BaseNodeComponent';
import BaseNodeData from '../types/BaseNodeData';
import { BaseNodeDefaultProps } from '../types/BaseNodeDefaultProps';
import { createNode } from '../utils/nodes';
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
 *
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
          const blockDefaultProps: BaseNodeDefaultProps = BlockComponent.getDefaultNodeProps();
          const node = {
            text: blockDefaultProps.previewText,
            width: blockDefaultProps.minWidth,
            height: blockDefaultProps.minHeight,
            data: {
              type: blockDefaultProps.type,
            },
          }

          return (
            <motion.div
              key={index}
              className="node"
              // @ts-ignore
              onMouseDown={(event) => onNodeDragStart(event, node)}
              onClick={(event) => {
                const newNode: BaseNodeData = createNode(node);

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
