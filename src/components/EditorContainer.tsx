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
import { addNodeAndEdge } from 'reaflow';
import { EdgeData } from 'reaflow/dist/types';
import { v1 as uuid } from 'uuid'; // XXX Use v1 for uniqueness - See https://www.sohamkamani.com/blog/2016/10/05/uuid1-vs-uuid4/
import BaseNodeData from '../types/BaseNodeData';
import { createNode } from '../utils/nodes';
import BaseNode from './nodes/BaseNode';
import NodesContainer from './NodesContainer';
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

  const [nodes, setNodes] = useState<BaseNodeData[]>([
    {
      id: uuid(),
      text: 'Information',
      width: 200,
      height: 400,
      data: {
        type: 'information',
      },
    },
  ]);
  const [edges, setEdges] = useState<EdgeData[]>([]);

  const dragControls = useDragControls();
  const [enteredNode, setEnteredNode] = useState<BaseNodeData | undefined>(undefined);
  const [activeDraggedBlock, setActiveDraggedBlock] = useState<BaseNodeData | undefined>(undefined);
  const [isDroppable, setDroppable] = useState<boolean>(false);

  const onNodeDragStart = (event: AnyPointerEvent, node: BaseNodeData) => {
    console.log('Start of Dragging', event, node);
    setActiveDraggedBlock(node);
    dragControls.start(event, { snapToCursor: true });
  };

  const onNodeDragEnd = (event: AnyPointerEvent, info: PanInfo) => {
    console.log('End of Dragging', event);
    console.log('droppable', isDroppable);

    if (isDroppable) {
      console.log('activeDraggedBlock', activeDraggedBlock);
      console.log('enteredNode', enteredNode);

      const newNode: BaseNodeData = createNode(activeDraggedBlock);
      const result = addNodeAndEdge(
        nodes,
        edges,
        newNode,
        enteredNode,
      );
      setNodes(result.nodes);
      setEdges(result.edges);
    }

    setDroppable(false);
    setActiveDraggedBlock(undefined);
    setEnteredNode(undefined);
  };

  console.log('EditorContainer renders');

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
      <NodesContainer
        blocksContainerWidth={blocksContainerWidth}
        nodes={nodes}
        setNodes={setNodes}
        edges={edges}
        setEdges={setEdges}
        onNodeDragStart={onNodeDragStart}
      />

      <PlaygroundContainer
        blocksContainerWidth={blocksContainerWidth}
        nodes={nodes}
        setNodes={setNodes}
        edges={edges}
        setEdges={setEdges}
        isDroppable={isDroppable}
        setDroppable={setDroppable}
        enteredNode={enteredNode}
        setEnteredNode={setEnteredNode}
      />

      <Portal>
        <motion.div
          drag
          dragControls={dragControls}
          className="dragger"
          onDragEnd={onNodeDragEnd}
        >
          {activeDraggedBlock && (
            <BaseNode className="dragInner">
              {activeDraggedBlock.text}
            </BaseNode>
          )}
        </motion.div>
      </Portal>
    </div>
  );
};

export default EditorContainer;
