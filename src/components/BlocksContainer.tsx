import { css } from '@emotion/react';
import { motion } from 'framer-motion';
import { AnyPointerEvent } from 'framer-motion/types/gestures/PanSession';
import React from 'react';
import { NodeData } from 'reaflow';
import { EdgeData } from 'reaflow/dist/types';
import Block from '../types/Block';
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

  return (
    <div
      className={'blocks-container'}
      css={css`
        width: ${blocksContainerWidth};
        background-color: lightgrey;
      `}
    >
      <motion.div
        className="block"
        // @ts-ignore
        onMouseDown={(event) => onBlockDragStart(event, {
          name: InformationBlock.defaultName,
        })}
      >
        <InformationBlock isPreview={true} />
      </motion.div>

      <motion.div
        className="block"
        // @ts-ignore
        onMouseDown={(event) => onBlockDragStart(event, {
          name: QuestionBlock.defaultName,
        })}
      >
        <QuestionBlock isPreview={true} />
      </motion.div>
    </div>
  );
};

export default BlocksContainer;
