import classnames from 'classnames';
import cloneDeep from 'lodash.clonedeep';
import React from 'react';
import { Port } from 'reaflow';
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
import { canvasDatasetSelector } from '../../states/canvasDatasetSelector';
import { draggedEdgeFromPortState } from '../../states/draggedEdgeFromPortState';
import { edgesSelector } from '../../states/edgesState';
import { lastCreatedNodeState } from '../../states/lastCreatedNodeState';
import BaseEdgeData from '../../types/BaseEdgeData';
import BaseNodeData from '../../types/BaseNodeData';
import BasePortData from '../../types/BasePortData';
import BasePortProps from '../../types/BasePortProps';
import { OnBlockClick } from '../../types/BlockPickerMenu';
import { CanvasDataset } from '../../types/CanvasDataset';
import NodeType from '../../types/NodeType';
import { translateXYToCanvasPosition } from '../../utils/canvas';
import { createEdge } from '../../utils/edges';
import {
  addNodeAndEdgeThroughPorts,
  createNodeFromDefaultProps,
  getDefaultNodePropsWithFallback,
} from '../../utils/nodes';
import {
  getDefaultToPort,
  canConnectToDestinationPort,
} from '../../utils/ports';

type Props = {
  fromNodeId: string;
} & BasePortProps;

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
    id,
    properties,
    fromNodeId,
    onDragEnd: onDragEndInternal,
  } = props;

  const [blockPickerMenu, setBlockPickerMenu] = useRecoilState(blockPickerMenuState);
  const [canvasDataset, setCanvasDataset] = useRecoilState(canvasDatasetSelector);
  const [edges, setEdges] = useRecoilState(edgesSelector);
  const { nodes } = canvasDataset;
  const [draggedEdgeFromPort, setDraggedEdgeFromPort] = useRecoilState(draggedEdgeFromPortState);
  const setLastUpdatedNode: SetterOrUpdater<BaseNodeData | undefined> = useSetRecoilState(lastCreatedNodeState);
  const node: BaseNodeData = nodes.find((node: BaseNodeData) => node.id === fromNodeId) as BaseNodeData;
  const port: BasePortData = node?.ports?.find((port: BasePortData) => port.id === id) as BasePortData;
  const { displayedFrom, isDisplayed } = blockPickerMenu;

  // Highlight the current port if there is an edge being dragged from another port and if it can connect to the current port
  const isHighlighted = canConnectToDestinationPort(draggedEdgeFromPort?.fromNode, draggedEdgeFromPort?.fromPort, node, port, edges);

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
    let newDataset: CanvasDataset;

    if (draggedEdgeFromPort?.fromPort?.side === 'EAST') {
      // The drag started from an EAST port, so we must add the new node on the right of existing node
      newDataset = addNodeAndEdgeThroughPorts(cloneDeep(nodes), cloneDeep(edges), newNode, node, newNode, draggedEdgeFromPort?.fromPort);
    } else {
      // The drag started from a WEST port, so we must add the new node on the left of the existing node
      const fromPort: BasePortData = newNode?.ports?.find((port: BasePortData) => port?.side === 'EAST') as BasePortData;
      const toPort: BasePortData = draggedEdgeFromPort?.fromPort as BasePortData;

      newDataset = addNodeAndEdgeThroughPorts(cloneDeep(nodes), cloneDeep(edges), newNode, newNode, node, fromPort, toPort);
    }
    console.log('addNodeAndEdge fromNode', newNode, 'toNode', node, 'dataset', newDataset);
    console.log('newDataset', newDataset);

    setCanvasDataset(newDataset);
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
   * @param fromPort
   * @param extra
   */
  const onPortDragStart = (event: DragEvent, fromPosition: Position, fromPort: BasePortData, extra: any) => {
    console.log('onDragStart port: ', node, event, fromPosition, fromPort, extra);

    setDraggedEdgeFromPort({
      fromNode: node,
      fromPort: fromPort,
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
   * @param fromPort
   * @param extra
   */
  const onPortDragEnd = (dragEvent: DragEvent, initial: Position, fromPort: BasePortData, extra: any) => {
    console.log('onDragEnd port: ', node, dragEvent, dragEvent.event, initial, fromPort, extra);
    const { xy, distance, event } = dragEvent;
    const target = event?.target as Element;

    // Look up in the DOM to find the closest <foreignObject> element that contains the node's id
    const foreignObject: Element | null | undefined = target?.closest?.('g')?.previousElementSibling;
    const foreignObjectId: string | undefined = foreignObject?.id;
    const toNodeId: string | undefined = foreignObjectId?.replace('node-foreignObject-', '');
    console.log('closest foreignObject:', foreignObject, 'toNodeId:', toNodeId);

    if (toNodeId) {
      // The edge has been dropped into a port
      console.log('found closest node id', toNodeId);
      const {
        fromNode,
      } = draggedEdgeFromPort || {};
      const toNode: BaseNodeData | undefined = nodes.find((node: BaseEdgeData) => node.id === toNodeId);
      const newEdge: BaseEdgeData = createEdge(fromNode, toNode, fromPort, getDefaultToPort(toNode));

      console.log('Linking existing nodes through new edge', newEdge);
      setEdges([
        ...edges,
        newEdge,
      ]);

      // Hides the block picker menu
      setBlockPickerMenu({
        isDisplayed: false,
      });
    } else {
      // The edge hasn't been dropped into a port (canvas, etc.) - Doesn't matter, we display the block picker menu
      // Converts the x/y position to a Canvas position and apply some margin for the BlockPickerMenu to display on the right bottom of the cursor
      const [x, y] = translateXYToCanvasPosition(...xy, { top: 60, left: 10 });

      // Opens the block picker menu below the clicked element
      setBlockPickerMenu({
        displayedFrom: `port-${fromPort.id}`,
        isDisplayed: true, // Toggle on click XXX change later, should toggle but not easy to test when toggle is on
        onBlockClick,
        // Depending on the position of the canvas, you might need to deduce from x/y some delta
        left: x,
        top: y - settings.layout.nav.height,
        eventTarget: target,
      });
    }

    if (onDragEndInternal) {
      // Runs internal onDragEnd which removes the edge if it doesn't connect to anything
      onDragEndInternal(dragEvent, initial, fromPort, extra);
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
    // console.log('onPortEnter', event.target)
  };

  /**
   * Invoked when the mouse is leaves a port (hover stops).
   *
   * @param event
   * @param port
   */
  const onPortLeave = (event: React.MouseEvent<SVGGElement, MouseEvent>, port: BasePortData) => {
    // console.log('onPortLeave', event.target)
  };

  return (
    <Port
      {...props}
      className={classnames(id, 'port', {
        'is-highlighted': isHighlighted,
      })}
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
