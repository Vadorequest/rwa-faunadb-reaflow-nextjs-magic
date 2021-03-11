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
import { useUser } from '../../hooks/useUser';
import settings from '../../settings';
import { blockPickerMenuSelector } from '../../states/blockPickerMenuState';
import { canvasDatasetSelector } from '../../states/canvasDatasetSelector';
import { edgesSelector } from '../../states/edgesState';
import { nodesSelector } from '../../states/nodesState';
import { selectedEdgesSelector } from '../../states/selectedEdgesState';
import { selectedNodesSelector } from '../../states/selectedNodesState';
import { UserSession } from '../../types/auth/UserSession';
import BaseNodeData from '../../types/BaseNodeData';
import { CanvasDataset } from '../../types/CanvasDataset';
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
  const user: UserSession | null = useUser() as UserSession | null;

  /**
   * The canvas ref contains useful properties (xy, scroll, etc.) and functions (zoom, centerCanvas, etc.)
   *
   * @see https://reaflow.dev/?path=/story/docs-advanced-refs--page
   */
  useEffect(() => {
    console.log('canvasRef', canvasRef);
    canvasRef?.current?.fitCanvas?.();
  }, [canvasRef]);

  const [blockPickerMenu, setBlockPickerMenu] = useRecoilState(blockPickerMenuSelector);
  const [canvasDataset, setCanvasDataset] = useRecoilState(canvasDatasetSelector);
  const [nodes, setNodes] = useRecoilState(nodesSelector);
  const [edges, setEdges] = useRecoilState(edgesSelector);
  const [selectedNodes, setSelectedNodes] = useRecoilState(selectedNodesSelector);
  const [selectedEdges, setSelectedEdges] = useRecoilState(selectedEdgesSelector);
  const selections = selectedNodes; // TODO merge selected nodes and edges
  const [hasClearedUndoHistory, setHasClearedUndoHistory] = useState<boolean>(false);
  const [cursorXY, setCursorXY] = useState<[number, number]>([0, 0]);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  /**
   * When nodes or edges are modified, updates the persisted data in FaunaDB.
   *
   * Persisted data are automatically loaded upon page refresh.
   */
  useEffect(() => {
    // persistCanvasDatasetInLS(canvasDataset);

    // Only save changes once the stream has started, to avoid saving anything until the initial canvas dataset was initialized
    if (isStreaming) {
      // Ignore dataset changes if the dataset contains only a start node with no edge
      const isDefaultDataset = canvasDataset?.nodes?.length === 1 && canvasDataset?.edges?.length === 0 && canvasDataset?.nodes[0]?.data?.type === 'start';

      if (!isDefaultDataset) {
        updateUserCanvas(user, canvasDataset);
      } else {
        console.info('CanvasDataset has changed. Default dataset detected, database update aborted.');
      }
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
      console.info(`No "start" node found. Creating one automatically.`, nodes);
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
        />
      </canvasUtilsContext.Provider>
    </div>
  );
};

export default CanvasContainer;
