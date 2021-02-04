import { css } from '@emotion/react';
import { isBrowser } from '@unly/utils';
import {
  motion,
  PanInfo,
  useDragControls,
} from 'framer-motion';
import { AnyPointerEvent } from 'framer-motion/types/gestures/PanSession';
import { Portal } from 'rdk';
import React, {
  useRef,
  useState,
} from 'react';
import {
  addNodeAndEdge,
  CanvasRef,
  useProximity,
} from 'reaflow';
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

  // Controls from framer-motion for dragging
  const dragControls = useDragControls();

  // Used to create a reference to the canvas so we can pass it to the hook so it has knowledge about the canvas
  const canvasRef = useRef<CanvasRef | null>(null);

  // Used to determine if we can drop the element (onto the canvas)
  const [isDroppable, setDroppable] = useState<boolean>(false);

  // Used to know which node has been last entered, so that when the user ends the drag we can link the activeDraggedNode to it
  const [enteredNode, setEnteredNode] = useState<BaseNodeData | undefined>(undefined);

  // Used to know which node is being dragged by the user, so that we can display a "dragging preview" and link it to the enteredNode when drag ends
  const [activeDraggedNode, setActiveDraggedNode] = useState<BaseNodeData | undefined>(undefined);

  const {
    // The distance from the closest element
    distance,
    // Drag event handlers we need to hook into our drag
    onDragStart: onProximityDragStart,
    onDrag: onProximityDrag,
    onDragEnd: onProximityDragEnd,
  } = useProximity({
    // The ref we defined above
    canvasRef,
    onMatchChange: (match: string | null) => {
      // If there is a match, let's find the node in
      // our models here
      let matchNode: BaseNodeData | undefined = undefined;
      if (match) {
        matchNode = nodes.find(n => n.id === match);
      }

      // Now let's set the matched node
      setEnteredNode(matchNode);

      // We set this separately from the enteredNode because
      // you might want to do some validation on whether you can drop or not
      setDroppable(matchNode !== null);
    },
  });

  const onNodeDragStart = (event: AnyPointerEvent, node: BaseNodeData) => {
    console.log('Start of dragging', event, node);
    setActiveDraggedNode(node);
    onProximityDragStart(event as PointerEvent);

    // Have the drag snap to our cursor
    dragControls.start(event, { snapToCursor: true });
  };

  const onNodeDragEnd = (event: AnyPointerEvent, info: PanInfo) => {
    console.log('End of dragging', event);
    console.log('droppable', isDroppable);

    // Call our proximity to let it know we are done dragging
    onProximityDragEnd(event as PointerEvent);

    if (isDroppable) {
      console.log('activeDraggedBlock', activeDraggedNode);
      console.log('enteredNode', enteredNode);

      const newNode: BaseNodeData = createNode(activeDraggedNode);
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
    setActiveDraggedNode(undefined);
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

        .closest {
          stroke: yellow !important;
        }

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
        canvasRef={canvasRef}
        blocksContainerWidth={blocksContainerWidth}
        nodes={nodes}
        setNodes={setNodes}
        edges={edges}
        setEdges={setEdges}
        distance={distance}
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
          onDrag={onProximityDrag}
          onDragEnd={onNodeDragEnd}
        >
          {activeDraggedNode && (
            <BaseNode className="dragInner">
              {activeDraggedNode.text}
            </BaseNode>
          )}
        </motion.div>
      </Portal>
    </div>
  );
};

export default EditorContainer;
