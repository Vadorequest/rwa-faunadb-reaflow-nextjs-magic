import { Button } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isBrowser } from '@unly/utils';
import React, {
  MutableRefObject,
  useEffect,
  useState,
} from 'react';
import {
  Canvas,
  CanvasRef,
  EdgeProps,
  NodeProps,
  UndoRedoEvent,
  useUndo,
} from 'reaflow';
import { useRecoilState } from 'recoil';
import { useDebouncedCallback } from 'use-debounce';
import { v1 as uuid } from 'uuid';
import { usePreviousValue } from '../../hooks/usePreviousValue';
import useRenderingTrace from '../../hooks/useTraceUpdate';
import { useUserSession } from '../../hooks/useUserSession';
import settings from '../../settings';
import { blockPickerMenuSelector } from '../../states/blockPickerMenuState';
import { canvasDatasetSelector } from '../../states/canvasDatasetSelector';
import { selectedEdgesSelector } from '../../states/selectedEdgesState';
import { selectedNodesSelector } from '../../states/selectedNodesState';
import { UserSession } from '../../types/auth/UserSession';
import BaseNodeData from '../../types/BaseNodeData';
import { CanvasDataset } from '../../types/CanvasDataset';
import { QueueCanvasDatasetMutation } from '../../types/CanvasDatasetMutation';
import { TypeOfRef } from '../../types/faunadb/TypeOfRef';
import {
  applyPendingMutations,
  mutationsQueue,
} from '../../utils/canvasDatasetMutationsQueue';
import {
  onInit,
  onUpdate,
  updateUserCanvas,
} from '../../utils/canvasStream';
import { isOlderThan } from '../../utils/date';
import { createEdge } from '../../utils/edges';
import {
  createNodeFromDefaultProps,
  getDefaultNodePropsWithFallback,
} from '../../utils/nodes';
import {
  getDefaultFromPort,
  getDefaultToPort,
} from '../../utils/ports';
import canvasUtilsContext from '../context/canvasUtilsContext';
import BaseEdge from '../edges/BaseEdge';
import FaunaDBCanvasStream from '../FaunaDBCanvasStream';
import NodeRouter from '../nodes/NodeRouter';

type Props = {
  canvasRef: MutableRefObject<CanvasRef | null>;
}

/**
 * Canvas container.
 *
 * All nodes and edges are drawn within the <Canvas> element.
 * Handles undo/redo.
 * Handles selection of nodes/edges. (one at a time, multi-select isn't supported)
 *
 * Positioned in absolute position and takes all the spaces of its parent element (PlaygroundContainer).
 *
 * @see https://github.com/reaviz/reaflow
 * @see https://reaflow.dev/?path=/story/docs-getting-started-basics--page
 */
const CanvasContainer: React.FunctionComponent<Props> = (props): JSX.Element | null => {
  if (!isBrowser()) {
    return null;
  }

  const {
    canvasRef,
  } = props;
  const userSession = useUserSession();

  /**
   * The canvas ref contains useful properties (xy, scroll, etc.) and functions (zoom, centerCanvas, etc.)
   *
   * @see https://reaflow.dev/?path=/story/docs-advanced-refs--page
   */
  useEffect(() => {
    canvasRef?.current?.fitCanvas?.();
  }, [canvasRef]);

  const [blockPickerMenu, setBlockPickerMenu] = useRecoilState(blockPickerMenuSelector);
  const [canvasDataset, setCanvasDataset] = useRecoilState(canvasDatasetSelector);
  const [selectedNodes, setSelectedNodes] = useRecoilState(selectedNodesSelector);
  const [selectedEdges, setSelectedEdges] = useRecoilState(selectedEdgesSelector);
  const selections = selectedNodes; // TODO merge selected nodes and edges
  const [hasClearedUndoHistory, setHasClearedUndoHistory] = useState<boolean>(false);
  const [cursorXY, setCursorXY] = useState<[number, number]>([0, 0]);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [canvasDocRef, setCanvasDocRef] = useState<TypeOfRef | undefined>(undefined); // We store the document ref to avoid fetching it for every change
  const [mutationsCounter, setMutationsCounter] = useState<number>(0);
  useRenderingTrace('CanvasContainer', {
    ...props,
    blockPickerMenu,
    canvasDataset,
    selectedNodes,
    selectedEdges,
    hasClearedUndoHistory,
    cursorXY,
    isStreaming,
    canvasDocRef,
    mutationsCounter,
  });
  const nodes = canvasDataset?.nodes;
  const edges = canvasDataset?.edges;
  const previousCanvasDataset: CanvasDataset | undefined = usePreviousValue<CanvasDataset>(canvasDataset);

  /**
   * Applies all mutations that haven't been applied yet.
   */
  useEffect(() => {
    applyPendingMutations({ nodes, edges, mutationsCounter, setCanvasDataset });
  });

  /**
   * Adds a new patch to apply to the existing queue.
   *
   * @param patch
   * @param stateUpdateDelay (ms)
   */
  const queueCanvasDatasetMutation: QueueCanvasDatasetMutation = (patch, stateUpdateDelay = 0) => {
    mutationsQueue.push({
      status: 'pending',
      id: uuid(),
      elementId: patch.elementId,
      elementType: patch.elementType,
      operationType: patch.operationType,
      changes: patch.changes,
    });

    // Updating the mutations counter will re-render the component
    if (stateUpdateDelay) {
      setTimeout(() => {
        setMutationsCounter(mutationsCounter + 1);
      }, stateUpdateDelay);
    } else {
      setMutationsCounter(mutationsCounter + 1);
    }
  };

  /**
   * Debounces the database update invocation call.
   *
   * Helps avoid multiple DB updates and group them into one (by only considering the last one, which is the one that really matters).
   *
   * Due to debouncing, multiple database updates are avoided (when they happen in a close time-related burst),
   * which is really important in a real-time context because it'll greatly reduce update events received by ALL subscribed clients.
   *
   * By eliminating burst updates and only considering the latest update, we greatly reduce the stream of updates sent to the DB.
   * By ensuring those updates happen at most every 1 second (maxWait), which syncs the work being done locally with the remote,
   * we ensure the work being done locally doesn't fall behind what's done on the remote.
   *
   * XXX Because we handle nodes/edges using different states, without debouncing then adding/removing a node would trigger 2 updates:
   *  - One for adding/removing the node
   *  - One for adding/removing the edge
   *  Thanks to debouncing, there is only one actual DB update.
   */
  const debouncedUpdateUserCanvas = useDebouncedCallback(
    (canvasRef: TypeOfRef | undefined, user: Partial<UserSession>, newCanvasDataset: CanvasDataset, previousCanvasDataset: CanvasDataset | undefined) => {
      updateUserCanvas(canvasDocRef, user, canvasDataset, previousCanvasDataset);
    },
    100, // Wait 100ms for other changes to happen, if no change happen then invoke the update
    { maxWait: 1000 }, // In any case, wait for no more than 1 second, at most
  );

  /**
   * When nodes or edges are modified, updates the persisted data in FaunaDB.
   *
   * Persisted data are automatically loaded when the stream is initialized.
   */
  useEffect(() => {
    // Only save changes once the stream has started, to avoid saving anything until the initial canvas dataset was initialized
    if (isStreaming) {
      debouncedUpdateUserCanvas(canvasDocRef, userSession, canvasDataset, previousCanvasDataset);
    }
  }, [canvasDataset]);

  /**
   * Uses Reaflow Undo/Redo helpers.
   *
   * Automatically binds shortcuts (cmd+z/cmd+shift+z).
   *
   * TODO Doesn't handle massive undos through shortcut (cmd+z) very well - See https://github.com/reaviz/reaflow/issues/60
   *
   * @see https://reaflow.dev/?path=/story/demos-undo-redo
   */
  const {
    undo,
    redo,
    canUndo,
    canRedo,
    clear,
  } = useUndo({
    nodes,
    edges,
    onUndoRedo: (state: UndoRedoEvent) => {
      console.log('Undo / Redo', state);

      setCanvasDataset({
        nodes: state?.nodes || [],
        edges: state?.edges || [],
      });
    },
    maxHistory: Infinity,
  });

  /**
   * Ensures the "start" node and "end" node are always present.
   *
   * Will automatically create the start/end nodes, even when all the nodes have been deleted.
   * Disabled until the stream has started to avoid creating the start node even before we got the initial canvas dataset from the stream.
   */
  useEffect(() => {
    const existingStartNode: BaseNodeData | undefined = nodes?.find((node: BaseNodeData) => node?.data?.type === 'start');
    const existingEndNode: BaseNodeData | undefined = nodes?.find((node: BaseNodeData) => node?.data?.type === 'end');

    if ((!existingStartNode || !existingEndNode) && isStreaming) {
      console.groupCollapsed('Creating default canvas dataset');
      console.info(`No "start" or "end" node found. Creating them automatically.`, nodes, edges, existingStartNode, existingEndNode);
      const startNode: BaseNodeData = createNodeFromDefaultProps(getDefaultNodePropsWithFallback('start'));
      const endNode: BaseNodeData = createNodeFromDefaultProps(getDefaultNodePropsWithFallback('end'));
      const newNodes = [
        startNode,
        endNode,
      ];
      const newEdges = [
        createEdge(startNode, endNode, getDefaultFromPort(startNode), getDefaultToPort(endNode)),
      ];

      setCanvasDataset({
        nodes: newNodes,
        edges: newEdges,
      });

      // Clearing the undo/redo history to avoid allowing the editor to "undo" the creation of the "start" node
      // If the "start" node creation step is "undoed" then it'd be re-created automatically, which would erase the whole history
      // See https://github.com/reaviz/reaflow/issues/60#issuecomment-780499761
      // Doing it only once after a reset to avoid infinite loop rendering
      if (!hasClearedUndoHistory) {
        console.info('Clearing undo/redo history to start from a clean state.');
        clear();
        setHasClearedUndoHistory(true);
      }
      console.groupEnd();
    }
  }, [nodes]);

  /**
   * When clicking on the canvas:
   * - Unselect all elements (nodes, edges)
   * - Hide the block menu picker, unless it was opened through targeting the canvas itself
   *    (avoids closing the menu when dropping an edge on the canvas)
   *
   * XXX Sometimes, it is triggered even though the click doesn't target the canvas itself specifically.
   *  For instance, it might be triggered when clicking on an SVG displayed within a <foreignObject>.
   */
  const onCanvasClick = (event: React.MouseEvent<SVGGElement, MouseEvent>): void => {
    if (event.target === canvasRef?.current?.svgRef?.current) {
      // Unselecting all selected elements (nodes, edges)
      if (selectedNodes?.length > 0) {
        setSelectedNodes([]);
      }
      if (selectedEdges?.length > 0) {
        setSelectedEdges([]);
      }
      console.log('onCanvasClick event', event);

      let isBlockPickerMenuTargetingCanvas = false;
      if (typeof blockPickerMenu?.eventTarget !== 'undefined') {
        isBlockPickerMenuTargetingCanvas = blockPickerMenu?.eventTarget === canvasRef?.current?.svgRef?.current;
      }

      // Automatically hide the blockPickerMenu when clicking on the canvas, if it is displayed and was created more than a second ago
      // Using a delay is a workaround, because when dropping the edge onto the canvas, it counts as a click
      // If we weren't using a delay, the blockPickerMenu would be displayed and then automatically hidden
      if (blockPickerMenu?.isDisplayed && (!isBlockPickerMenuTargetingCanvas || isOlderThan(blockPickerMenu?.at, 1000))) {
        setBlockPickerMenu({
          isDisplayed: false,
        });
      }

      setCursorXY([event?.clientX, event?.clientY]);
    }
  };

  /**
   * Node component. All nodes will render trough this component.
   *
   * Uses the NodeRouter component which will render a different node layout, depending on the node "type".
   */
  const Node = (nodeProps: NodeProps) => {
    return (
      <NodeRouter
        nodeProps={nodeProps}
        queueCanvasDatasetMutation={queueCanvasDatasetMutation}
      />
    );
  };

  /**
   * Edge component. All edges will render trough this component.
   *
   * All edges render the same way, no matter to which node they're linked to.
   * (There is no "EdgeRouter", unlike with nodes)
   */
  const Edge = (edgeProps: EdgeProps) => {
    return (
      <BaseEdge
        {...edgeProps}
        queueCanvasDatasetMutation={queueCanvasDatasetMutation}
      />
    );
  };

  /**
   * Those options will be forwarded to elkLayout under the "options" property.
   *
   * @see https://github.com/reaviz/reaflow/blob/master/src/layout/elkLayout.ts Default values applied by Reaflow
   * @see https://github.com/kieler/elkjs#api
   * @see https://www.eclipse.org/elk/reference.html
   * @see https://www.eclipse.org/elk/reference/options.html
   */
  const elkLayoutOptions = {
    'elk.algorithm': 'layered',
  };

  return (
    <div
      className={'canvas-container'}
      css={css`
        // Positioned in absolute position and takes all the spaces of its parent element (PlaygroundContainer)
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        // CSS rules applied to the whole <Canvas> (global rules, within the <Canvas>)
        .reaflow-canvas {
          // Make all edges display an infinite dash animation
          .edge-svg-graph {
            stroke: ${settings.canvas.edges.strokeColor};
            stroke-dasharray: 5;
            animation: dashdraw .5s linear infinite;
            stroke-width: 1;

            &.is-selected {
              stroke: ${settings.canvas.edges.selected.strokeColor};
              stroke-dasharray: 0;
              animation: none;
            }
          }

          .port {
            // Ports are being highlighted during edge dragging, to make it obvious what are the possible destination ports
            &.is-highlighted {
              stroke: blue !important;
            }

            // Make all output ports used by IfNode display differently to distinguish them easily
            &.port-if {
              &-true {
                stroke: green !important;
              }

              &-false {
                stroke: red !important;
              }
            }
          }

          @keyframes dashdraw {
            0% {
              stroke-dashoffset: 10;
            }
          }
        }
      `}
    >
      <div
        style={{ position: 'absolute', top: 10, left: 20, zIndex: 999 }}
      >
        <Button
          variant="primary"
          onClick={undo}
          disabled={!canUndo}
        >
          Undo
        </Button>
        <Button
          variant="primary"
          onClick={redo}
          disabled={!canRedo}
        >
          Redo
        </Button>
      </div>

      <div
        style={{ position: 'absolute', top: 10, right: 20, zIndex: 999 }}
      >
        <Button
          variant="primary"
          onClick={() => {
            if (confirm(`Remove all nodes and edges?`)) {
              setHasClearedUndoHistory(false); // Reset to allow clearing history even if the option is used several times in the same session
              setCanvasDataset({
                nodes: [],
                edges: [],
              });
            }
          }}
        >
          Clear all
        </Button>
      </div>

      <div
        style={{ position: 'absolute', bottom: 10, right: 20, zIndex: 999 }}
      >
        <Button
          variant="primary"
          onClick={canvasRef?.current?.zoomOut}
        >
          <FontAwesomeIcon
            icon={['fas', 'search-minus']}
          />
        </Button>
        <Button
          variant="primary"
          onClick={canvasRef?.current?.zoomIn}
        >
          <FontAwesomeIcon
            icon={['fas', 'search-plus']}
          />
        </Button>
        <Button
          variant="primary"
          onClick={canvasRef?.current?.centerCanvas}
        >
          <FontAwesomeIcon
            icon={['fas', 'bullseye']}
          />
        </Button>
        <Button
          variant="primary"
          onClick={canvasRef?.current?.fitCanvas}
        >
          <FontAwesomeIcon
            icon={['fas', 'compress-arrows-alt']}
          />
        </Button>
      </div>

      <div
        style={{ position: 'absolute', bottom: 10, left: 20, zIndex: 999 }}
      >
        X: {cursorXY?.[0]} | Y: {cursorXY?.[1]}
      </div>

      <canvasUtilsContext.Provider
        value={{
          containerRef: canvasRef?.current?.containerRef,
          centerCanvas: canvasRef?.current?.centerCanvas,
          fitCanvas: canvasRef?.current?.fitCanvas,
          setZoom: canvasRef?.current?.setZoom,
          zoomIn: canvasRef?.current?.zoomIn,
          zoomOut: canvasRef?.current?.zoomOut,
        }}
      >
        <Canvas
          ref={canvasRef}
          className={'reaflow-canvas'}
          direction={settings.canvas.direction}
          onCanvasClick={onCanvasClick}
          maxWidth={settings.canvas.maxWidth}
          maxHeight={settings.canvas.maxHeight}
          nodes={nodes}
          edges={edges}
          selections={selections}
          node={Node}
          edge={Edge}
          onLayoutChange={layout => console.log('Layout', layout)}
          layoutOptions={elkLayoutOptions}
        />

        {/* Handles the real-time stream */}
        <FaunaDBCanvasStream
          onInit={(canvasDataset: CanvasDataset) => {
            onInit(canvasDataset);

            // Mark the stream has running
            setIsStreaming(true);
          }}
          onUpdate={onUpdate}
          setCanvasDocRef={setCanvasDocRef}
        />
      </canvasUtilsContext.Provider>
    </div>
  );
};

export default CanvasContainer;
