import { css } from '@emotion/react';
import { isBrowser } from '@unly/utils';
import {
  motion,
  PanInfo,
  useDragControls,
} from 'framer-motion';
import { AnyPointerEvent } from 'framer-motion/types/gestures/PanSession';
import { Portal } from 'rdk';
import React, { useRef } from 'react';
import {
  addNodeAndEdge,
  CanvasRef,
  useProximity,
} from 'reaflow';
import { useRecoilState } from 'recoil';
import settings from '../../settings';
import { activeDraggedNodeState } from '../../states/activeDraggedNodeState';
import { edgesState } from '../../states/edgesState';
import { isDraggedNodeCloseState } from '../../states/isDraggedNodeCloseState';
import { isDraggedNodeDroppableState } from '../../states/isDraggedNodeDroppableState';
import { currentDraggedNodeTargetState } from '../../states/currentDraggedNodeTargetState';
import { nodesState } from '../../states/nodesState'; // XXX Use v1 for uniqueness - See https://www.sohamkamani.com/blog/2016/10/05/uuid1-vs-uuid4/
import BaseNodeData from '../../types/BaseNodeData';
import { createNode } from '../../utils/nodes';
import BasePreviewBlock from '../blocks/BasePreviewBlock';
import ContainerSeparator from './ContainerSeparator';
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
  const [nodes, setNodes] = useRecoilState(nodesState);
  const [edges, setEdges] = useRecoilState(edgesState);
  const [isDroppable, setDroppable] = useRecoilState(isDraggedNodeDroppableState);
  const [currentDraggedNodeTarget, setCurrentDraggedNodeTarget] = useRecoilState(currentDraggedNodeTargetState);
  const [activeDraggedNode, setActiveDraggedNode] = useRecoilState(activeDraggedNodeState);
  const [isDraggedNodeClose, setIsDraggedNodeClose] = useRecoilState(isDraggedNodeCloseState);

  // Used to create a reference to the canvas so we can pass it to the hook so it has knowledge about the canvas
  const canvasRef = useRef<CanvasRef | null>(null);

  // Controls from framer-motion for dragging
  const dragControls = useDragControls();

  const {
    // Drag event handlers we need to hook into our drag
    onDragStart: onProximityDragStart,
    onDrag: onProximityDrag,
    onDragEnd: onProximityDragEnd,
  } = useProximity({
    canvasRef,

    onIntersects: (match: string | null) => {
      console.info('Node Intersected', match);
    },

    onDistanceChange: (distance: number | null) => {
      console.info('Distance Changed', distance);

      if (distance && distance < settings.dnd.closeDistanceThreshold && !isDraggedNodeClose) {
        console.info('setIsDraggedNodeClose', true);
        setIsDraggedNodeClose(true);
      } else if ((!distance || distance > settings.dnd.closeDistanceThreshold) && isDraggedNodeClose) {
        console.info('setIsDraggedNodeClose', false);
        setIsDraggedNodeClose(false);
      }
    },

    onMatchChange: (match: string | null, distance: number | null) => {
      console.info('Match Changed!', match);

      // If there is a match, let's find the node in
      // our models here
      let matchNode: BaseNodeData | undefined = undefined;
      if (match) {
        matchNode = nodes.find(n => n.id === match);
      }

      // Now let's set the matched node
      setCurrentDraggedNodeTarget(matchNode);

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
      console.log('enteredNode', currentDraggedNodeTarget);

      const newNode: BaseNodeData = createNode(activeDraggedNode);
      const result = addNodeAndEdge(
        nodes,
        edges,
        newNode,
        currentDraggedNodeTarget,
      );
      setNodes(result.nodes);
      setEdges(result.edges);
    }

    setDroppable(false);
    setActiveDraggedNode(undefined);
    setCurrentDraggedNodeTarget(undefined);
  };

  console.log('EditorContainer renders', nodes);

  return (
    <div
      className={'editor-container'}
      css={css`
        display: flex;
        position: relative;
        width: 100vw;
        height: calc(100vh - 120px);

        .dnd-closest {
          stroke: ${settings.dnd.colorClosest} !important;
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
        onNodeDragStart={onNodeDragStart}
      />

      <ContainerSeparator />

      <PlaygroundContainer
        canvasRef={canvasRef}
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
            <BasePreviewBlock className="dragInner">
              {activeDraggedNode.text}
            </BasePreviewBlock>
          )}
        </motion.div>
      </Portal>
    </div>
  );
};

export default EditorContainer;
