import { Button } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { isBrowser } from '@unly/utils';
import React, {
  MutableRefObject,
  useEffect,
} from 'react';
import {
  Canvas,
  CanvasRef,
  EdgeProps,
  hasLink,
  NodeData,
  NodeProps,
  UndoRedoEvent,
  useUndo,
} from 'reaflow';
import { useRecoilState } from 'recoil';
import settings from '../../settings';
import { blockPickerMenuState } from '../../states/blockPickerMenuState';
import { edgesState } from '../../states/edgesState';
import { lastCreatedNodeState } from '../../states/lastCreatedNodeState';
import { nodesState } from '../../states/nodesState';
import { selectedNodesState } from '../../states/selectedNodesState';
import BaseNodeData from '../../types/BaseNodeData';
import BasePortData from '../../types/BasePortData';
import {
  createNodeFromDefaultProps,
  getDefaultNodePropsWithFallback,
} from '../../utils/nodes';
import { persistGraphDataInLS } from '../../utils/persistGraph';
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
 *
 * Positioned in absolute position and takes all the spaces of its parent element (EditorContainer).
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

  const [blockPickerMenu, setBlockPickerMenu] = useRecoilState(blockPickerMenuState);
  const [nodes, setNodes] = useRecoilState(nodesState);
  const [edges, setEdges] = useRecoilState(edgesState);
  const [selectedNodes, setSelectedNodes] = useRecoilState(selectedNodesState);
  const selections = selectedNodes.map((node) => node.id);
  const [lastCreatedNode] = useRecoilState(lastCreatedNodeState);

  /**
   * When nodes or edges are modified, updates the persisted data in the local storage.
   *
   * Persisted data are automatically loaded upon page refresh.
   */
  useEffect(() => {
    persistGraphDataInLS(nodes, edges);
  }, [nodes, edges]);

  /**
   * Ensures the start node is always present.
   *
   * Will automatically create the start node even if all the nodes are deleted.
   */
  useEffect(() => {
    const startNode: BaseNodeData | undefined = nodes?.find((node: BaseNodeData) => node?.data?.type === 'start');

    if (!startNode) {
      setNodes([
        ...nodes,
        createNodeFromDefaultProps(getDefaultNodePropsWithFallback('start')),
      ]);
    }
  }, [nodes]);

  /**
   * Uses Reaflow Undo/Redo helpers.
   *
   * Automatically binds shortcuts (cmd+z/cmd+shift+z).
   *
   * TODO Doesn't handle massive undos very well - See https://github.com/reaviz/reaflow/issues/60
   *
   * @see https://reaflow.dev/?path=/story/demos-undo-redo
   */
  const {
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndo({
    nodes,
    edges,
    onUndoRedo: (state: UndoRedoEvent) => {
      console.log('Undo / Redo', state);
      setEdges(state?.edges || []);
      setNodes(state?.nodes || []);
    },
    maxHistory: Infinity,
  });

  /**
   * When clicking on the canvas:
   * - Unselect all elements (nodes, edges)
   * - Hide the block menu picker, unless it was opened through targeting the canvas itself
   *    (avoids closing the menu when dropping an edge on the canvas)
   */
  const onCanvasClick = () => {
    setSelectedNodes([]);
    console.log('target', blockPickerMenu?.eventTarget);

    let isBlockPickerMenuTargetingCanvas = false;
    if (typeof blockPickerMenu?.eventTarget !== 'undefined') {
      isBlockPickerMenuTargetingCanvas = blockPickerMenu?.eventTarget === canvasRef?.current?.svgRef?.current;
    }

    if (blockPickerMenu?.isDisplayed && !isBlockPickerMenuTargetingCanvas) {
      setBlockPickerMenu({
        isDisplayed: false,
      });
    }
  };

  /**
   * Callback to check if a node is linkable or not.
   *
   * If it returns true, then "onNodeLink" will be invoked.
   *
   * @param from
   * @param to
   * @param port
   */
  const onNodeLinkCheck = (from: NodeData, to: NodeData, port?: BasePortData): undefined | boolean => {
    // TODO ensure to/from are Ports
    console.log('onNodeLinkCheck', 'will link?', !hasLink(edges, from, to), from, to);
    return !hasLink(edges, from, to);
  };

  /**
   * Callback when a node is linked.
   *
   * Invoked when "onNodeLinkCheck" returns true.
   *
   * @param from
   * @param to
   * @param port
   */
  const onNodeLink = (from: NodeData, to: NodeData, port?: BasePortData): void => {
    console.log('onNodeLink', from, to);
    const id = `${from.id}-${to.id}`;

    setEdges([
      ...edges,
      {
        id,
        from: from.id,
        to: to.id,
      },
    ]);
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
        lastCreatedNode={lastCreatedNode}
      />
    );
  };

  /**
   * Edge component. All edges will render trough this component.
   *
   * All edges render the same way, no matter to which node they're linked to.
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
   * @see https://www.eclipse.org/elk/reference.html
   * @see https://www.eclipse.org/elk/reference/options.html
   * @see https://github.com/reaviz/reaflow/blob/master/src/layout/elkLayout.ts
   */
  const elkLayoutOptions = {
    // See https://github.com/kieler/elkjs#example
    'elk.algorithm': 'layered', // Values can be found at https://github.com/kieler/elkjs#api
    // 'elk.layered.spacing.edgeEdgeBetweenLayers': '20',
    // 'elk.layered.spacing.edgeNodeBetweenLayers': '20',
    // 'elk.spacing.individual': '20',
    // 'elk.graphviz.layerSpacingFactor': '3',
    // 'elk.layered.layering.strategy': 'NETWORK_SIMPLEX',
    // 'elk.layered.layering.strategy': 'LONGEST_PATH',
  };

  return (
    <div
      className={'canvas-container'}
      css={css`
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        // CSS rules applied to the whole <Canvas> (global rules, within the <Canvas>)
        .reaflow-canvas {
          // Make all edges display an infinite dash animation
          .edge {
            stroke: #b1b1b7;
            stroke-dasharray: 5;
            animation: dashdraw .5s linear infinite;
            stroke-width: 1;
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
              setNodes([]);
              setEdges([]);
            }
          }}
        >
          Clear all
        </Button>
      </div>

      <Canvas
        ref={canvasRef}
        className={'reaflow-canvas'}
        direction={settings.canvas.direction}
        onCanvasClick={onCanvasClick}
        nodes={nodes}
        edges={edges}
        selections={selections}
        node={Node}
        edge={Edge}
        onLayoutChange={layout => console.log('Layout', layout)}
        onNodeLinkCheck={onNodeLinkCheck}
        onNodeLink={onNodeLink}
        layoutOptions={elkLayoutOptions}
      />
    </div>
  );
};

export default CanvasContainer;
