import { css } from '@emotion/react';
import { motion } from 'framer-motion';
import { AnyPointerEvent } from 'framer-motion/types/gestures/PanSession';
import React from 'react';
import { NodeData } from 'reaflow';
import { EdgeData } from 'reaflow/dist/types';
import Block from '../types/Block';
import BlockComponent from '../types/BlockComponent';
import InformationBlock from './blocks/InformationBlock';
import QuestionBlock from './blocks/QuestionBlock';

type Props = {
  blocksContainerWidth: string;
  nodes: NodeData[];
  setNodes: (nodes: NodeData[]) => void;
  edges: EdgeData[];
  setEdges: (edges: EdgeData[]) => void;
  onBlockDragStart: (event: AnyPointerEvent, block: Block) => void;
}

/**
 *
 */
const BlocksContainer: React.FunctionComponent<Props> = (props): JSX.Element | null => {
  const {
    blocksContainerWidth,
    nodes,
    setNodes,
    edges,
    setEdges,
    onBlockDragStart,
  } = props;

  const blockComponents: BlockComponent[] = [
    InformationBlock,
    QuestionBlock,
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
        blockComponents.map((BlockComponent: BlockComponent, index: number) => {
          return (
            <motion.div
              key={index}
              className="block"
              // @ts-ignore
              onMouseDown={(event) => onBlockDragStart(event, {
                name: BlockComponent.defaultName,
              })}
            >
              <BlockComponent
                // @ts-ignore
                isPreview={true}
              />
            </motion.div>
          )
        })
      }
    </div>
  );
};

export default BlocksContainer;
