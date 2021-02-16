import cloneDeep from 'lodash.clonedeep';
import React from 'react';
import { Port } from 'reaflow';
import { PortProps } from 'reaflow/dist/symbols/Port/Port';
import {
  DragEvent,
  Position,
} from 'reaflow/dist/utils/useNodeDrag';
import {
  SetterOrUpdater,
  useRecoilState,
  useSetRecoilState,
} from 'recoil';
import settings from '../../settings';
import { blockPickerMenuState } from '../../states/blockPickerMenuState';
import { draggedEdgeFromPortState } from '../../states/draggedEdgeFromPortState';
import { edgesState } from '../../states/edgesState';
import { lastCreatedNodeState } from '../../states/lastCreatedNodeState';
import { nodesState } from '../../states/nodesState';
import BaseNodeData from '../../types/BaseNodeData';
import BasePortData from '../../types/BasePortData';
import { OnBlockClick } from '../../types/BlockPickerMenu';
import NodeType from '../../types/NodeType';
import { translateXYToCanvasPosition } from '../../utils/canvas';
import {
  addNodeAndEdgeThroughPorts,
  createNodeFromDefaultProps,
  getDefaultNodePropsWithFallback,
} from '../../utils/nodes';

type Props = {
  fromNodeId: string;
} & Partial<PortProps>;

/**
 * Base port component.
 *
 * This component contains shared business logic common to all ports.
 * It renders a Reaflow <Port> component.
 *
 * The Port is rendered as SVG <g> wrapper, which contains the <rect> that displays the port itself.
 *
 * @see https://reaflow.dev/?path=/story/demos-ports
 */
const BasePort: React.FunctionComponent<Props> = (props) => {
  const {
    fromNodeId,
    onDragEnd: onDragEndInternal,
    ...rest
  } = props;

  const [blockPickerMenu, setBlockPickerMenu] = useRecoilState(blockPickerMenuState);
  const [nodes, setNodes] = useRecoilState(nodesState);
  const [edges, setEdges] = useRecoilState(edgesState);
  const [draggedEdgeFromPort, setDraggedEdgeFromPort] = useRecoilState(draggedEdgeFromPortState);
  const setLastUpdatedNode: SetterOrUpdater<BaseNodeData | undefined> = useSetRecoilState(lastCreatedNodeState);
  const node: BaseNodeData = nodes.find((node) => node.id === fromNodeId) as BaseNodeData;
  const { displayedFrom, isDisplayed } = blockPickerMenu;

  const style = {
    fill: 'white',
    stroke: 'white',
  };

  /**
   * Creates a node based on the block that's been clicked within the BlockPickerMenu.
   *
   * Automatically creates the edge between the source node and the newly created node, and connects them through their ports.
   *
   * @param nodeType
   */
  const onBlockClick: OnBlockClick = (nodeType: NodeType) => {
    console.log('onBlockClick (from port)', nodeType, draggedEdgeFromPort);
    const newNode = createNodeFromDefaultProps(getDefaultNodePropsWithFallback(nodeType));
    const results = addNodeAndEdgeThroughPorts(cloneDeep(nodes), cloneDeep(edges), newNode, node);
    console.log('addNodeAndEdge fromNode', newNode, 'toNode', node, 'results', results);

    setNodes(results.nodes);
    setEdges(results.edges);
    setLastUpdatedNode(newNode);
  };

  /**
   * Invoked when clicking on a port.
   *
   * Displays the BlockPickerMenu, which can then be used to select which Block to add to the canvas.
   * If the BlockPickerMenu was already displayed, hides it if it was opened from the same port.
   *
   * @param event
   * @param port
   */
  const onPortClick = (event: React.MouseEvent<SVGGElement, MouseEvent>, port: BasePortData) => {
    setBlockPickerMenu({
      displayedFrom: `port-${port.id}`,
      isDisplayed: displayedFrom === `port-${port.id}` ? !isDisplayed : true,
      onBlockClick,
      eventTarget: event.target,
    });
  };

  /**
   * Invoked when a port is has started being dragged.
   *
   * Stores the dragged edge in the shared state, to allow other components to know which edge is being dragged.
   *
   * @param event
   * @param fromPosition
   * @param port
   * @param extra
   */
  const onPortDragStart = (event: DragEvent, fromPosition: Position, port: BasePortData, extra: any) => {
    console.log('onDragStart port: ', node, event, fromPosition, port, extra);

    setDraggedEdgeFromPort({
      fromNode: node,
      fromPort: port,
      fromPosition: fromPosition,
    });
  };

  /**
   * Invoked when a port is has been dropped.
   *
   * Displays the BlockPickerMenu at the drop location, which can then be used to select which Block to add to the canvas.
   * Also runs the Reaflow own "onDragEndInternal", which is necessary to avoid leaving ghost edges connected to nothing.
   *
   * @param dragEvent
   * @param initial
   * @param port
   * @param extra
   */
  const onPortDragEnd = (dragEvent: DragEvent, initial: Position, port: BasePortData, extra: any) => {
    const { xy, distance, event } = dragEvent;
    // @ts-ignore
    const { target } = event;

    // Converts the x/y position to a Canvas position and apply some margin for the BlockPickerMenu to display on the right bottom of the cursor
    const [x, y] = translateXYToCanvasPosition(...xy, { top: 60, left: 10 });

    // Open the block picker menu below the clicked element
    setBlockPickerMenu({
      displayedFrom: `port-${port.id}`,
      isDisplayed: true, // Toggle on click XXX change later, should toggle but not easy to test when toggle is on
      onBlockClick,
      // Depending on the position of the canvas, you might need to deduce from x/y some delta
      left: x,
      top: y - settings.layout.nav.height,
      eventTarget: target,
    });

    if (onDragEndInternal) {
      // Runs internal onDragEnd which removes the edge if it doesn't connect to anything
      onDragEndInternal(dragEvent, initial, port, extra);
    }

    // Reset the edge being dragged
    setDraggedEdgeFromPort(undefined);
  };

  /**
   * Invoked when the mouse is enters a port (hover starts).
   *
   * @param event
   * @param port
   */
  const onPortEnter = (event: React.MouseEvent<SVGGElement, MouseEvent>, port: BasePortData) => {
    // console.log('onEnter port: ', node, event);
  };

  /**
   * Invoked when the mouse is leaves a port (hover stops).
   *
   * @param event
   * @param port
   */
  const onPortLeave = (event: React.MouseEvent<SVGGElement, MouseEvent>, port: BasePortData) => {
    // console.log('onLeave port: ', node, event);
  };

  return (
    <Port
      {...rest}
      onClick={onPortClick}
      onDragStart={onPortDragStart}
      onDragEnd={onPortDragEnd}
      onEnter={onPortEnter}
      onLeave={onPortLeave}
      style={style}
      rx={settings.canvas.ports.radius}
      ry={settings.canvas.ports.radius}
    />
  );
};

export default BasePort;
