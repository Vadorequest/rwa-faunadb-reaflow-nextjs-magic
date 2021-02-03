import { css } from '@emotion/react';
import { isBrowser } from '@unly/utils';
import {
  motion,
  PanInfo,
  useDragControls,
} from 'framer-motion';
import { AnyPointerEvent } from 'framer-motion/types/gestures/PanSession';
import { Portal } from 'rdk';
import React, { useState } from 'react';
import {
  addNodeAndEdge,
  NodeData,
} from 'reaflow';
import { EdgeData } from 'reaflow/dist/types';
import BaseBlockData from '../types/BaseBlockData';
import BaseBlock from './blocks/BaseBlock';
import BlocksContainer from './BlocksContainer';
import PlaygroundContainer from './PlaygroundContainer';

type Props = {}

/**
 * Displays the blocks container (left) and the playground (right).
 */
const EditorContainer: React.FunctionComponent<Props> = (props): JSX.Element | null => {
  if (!isBrowser()) {
    return null;
  }
  const blocksContainerWidth = '30vw';

  const [nodes, setNodes] = useState<NodeData[]>([
    {
      id: '2',
      text: 'Mother',
      data: {
        gender: 'female',
      },
    },
    {
      id: '3',
      text: 'Daughter',
      data: {
        gender: 'female',
      },
    },
    {
      id: '4',
      text: 'Son',
      data: {
        gender: 'male',
      },
    },
  ]);
  const [edges, setEdges] = useState<EdgeData[]>([
    {
      id: '2-3',
      from: '2',
      to: '3',
    },
    {
      id: '2-4',
      from: '2',
      to: '4',
    },
  ]);

  const dragControls = useDragControls();
  const [enteredNode, setEnteredNode] = useState<NodeData | undefined>(undefined);
  const [activeDraggedBlock, setActiveDraggedBlock] = useState<BaseBlockData | undefined>(undefined);
  const [droppable, setDroppable] = useState<boolean>(false);

  const onBlockDragStart = (event: AnyPointerEvent, block: BaseBlockData) => {
    console.log('Start of Dragging', event, block);
    setActiveDraggedBlock(block);
    dragControls.start(event, { snapToCursor: true });
  };

  const onBlockDragEnd = (event: AnyPointerEvent, info: PanInfo) => {
    console.log('End of Dragging', event);
    console.log('droppable', droppable)

    if (droppable) {
      const id = `${activeDraggedBlock?.name}-${Math.floor(Math.random() * (1000 - 1 + 1)) + 1}`;
      const result = addNodeAndEdge(
        nodes,
        edges,
        {
          id,
          text: id,
        },
        enteredNode,
      );
      setNodes(result.nodes);
      setEdges(result.edges);
    }

    setDroppable(false);
    setActiveDraggedBlock(undefined);
    setEnteredNode(undefined);
  };

  return (
    <div
      className={'editor-container'}
      css={css`
        display: flex;
        position: relative;
        width: 100vw;
        height: calc(100vh - 120px);

        .dragger {
          z-index: 999;
          pointer-events: none;
          user-select: none;
          cursor: grabbing;
          height: 70px;
          width: 150px;
        }

        .dragInner {
          pointer-events: none;
          margin-left: 80px;
          border-radius: 5px;
          background: black;
          border: solid 1px #00c5be;
          height: 40px;
          width: 40px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}
    >
      <BlocksContainer
        blocksContainerWidth={blocksContainerWidth}
        nodes={nodes}
        setNodes={setNodes}
        edges={edges}
        setEdges={setEdges}
        onBlockDragStart={onBlockDragStart}
      />

      <PlaygroundContainer
        blocksContainerWidth={blocksContainerWidth}
        nodes={nodes}
        setNodes={setNodes}
        edges={edges}
        setEdges={setEdges}
        setDroppable={setDroppable}
        setEnteredNode={setEnteredNode}
      />

      <Portal>
        <motion.div
          drag
          dragControls={dragControls}
          className="dragger"
          onDragEnd={onBlockDragEnd}
        >
          {activeDraggedBlock && (
            <BaseBlock className="dragInner">
              {activeDraggedBlock.name}
            </BaseBlock>
          )}
        </motion.div>
      </Portal>
    </div>
  );
};

export default EditorContainer;
