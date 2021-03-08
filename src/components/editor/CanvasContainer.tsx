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
import { updateSharedCanvasDocument } from '../../lib/faunadbClient';
import settings from '../../settings';
import { blockPickerMenuSelector } from '../../states/blockPickerMenuState';
import { canvasDatasetSelector } from '../../states/canvasDatasetSelector';
import { edgesSelector } from '../../states/edgesState';
import { nodesSelector } from '../../states/nodesState';
import { selectedEdgesSelector } from '../../states/selectedEdgesState';
import { selectedNodesSelector } from '../../states/selectedNodesState';
import BaseNodeData from '../../types/BaseNodeData';
import { isOlderThan } from '../../utils/date';
import {
  createNodeFromDefaultProps,
  getDefaultNodePropsWithFallback,
} from '../../utils/nodes';
import canvasUtilsContext from '../context/canvasUtilsContext';
import BaseEdge from '../edges/BaseEdge';
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

  /**
   * When nodes or edges are modified, updates the persisted data in FaunaDB.
   *
   * Persisted data are automatically loaded upon page refresh.
   */
  useEffect(() => {
    // persistCanvasDatasetInLS(canvasDataset);
    updateSharedCanvasDocument(canvasDataset);
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
   * Ensures the start node is always present.
   *
   * Will automatically create the start node even if all the nodes are deleted.
   */
  useEffect(() => {
    const startNode: BaseNodeData | undefined = nodes?.find((node: BaseNodeData) => node?.data?.type === 'start');

    if (!startNode) {
      console.info(`No "start" node found. Creating one automatically.`, nodes);
      setNodes([
        ...nodes,
        createNodeFromDefaultProps(getDefaultNodePropsWithFallback('start')),
      ]);

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
          onClick={undo}
          disabled={!canUndo}
        >
          Undo
        </Button>
        <Button
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
          onClick={canvasRef?.current?.zoomOut}
        >
          <FontAwesomeIcon
            icon={['fas', 'search-minus']}
          />
        </Button>
        <Button
          onClick={canvasRef?.current?.zoomIn}
        >
          <FontAwesomeIcon
            icon={['fas', 'search-plus']}
          />
        </Button>
        <Button
          onClick={canvasRef?.current?.centerCanvas}
        >
          <FontAwesomeIcon
            icon={['fas', 'bullseye']}
          />
        </Button>
        <Button
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
      </canvasUtilsContext.Provider>
    </div>
  );
};

export default CanvasContainer;
