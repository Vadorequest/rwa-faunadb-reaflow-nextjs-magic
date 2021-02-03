import { css } from '@emotion/react';
import { motion } from 'framer-motion';
import { AnyPointerEvent } from 'framer-motion/types/gestures/PanSession';
import React from 'react';
import { NodeData } from 'reaflow';
import { EdgeData } from 'reaflow/dist/types';
import BaseBlockData from '../types/BaseBlockData';
import BaseBlockComponent from '../types/BaseBlockComponent';
import InformationBlock from './blocks/InformationBlock';
import QuestionBlock from './blocks/QuestionBlock';

type Props = {
  blocksContainerWidth: string;
  nodes: NodeData[];
  setNodes: (nodes: NodeData[]) => void;
  edges: EdgeData[];
  setEdges: (edges: EdgeData[]) => void;
  onBlockDragStart: (event: AnyPointerEvent, block: BaseBlockData) => void;
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

  const blockComponents: BaseBlockComponent[] = [
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
        blockComponents.map((BlockComponent: BaseBlockComponent, index: number) => {
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
