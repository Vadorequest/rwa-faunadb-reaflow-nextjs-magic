import cloneDeep from 'lodash.clonedeep';
import React from 'react';
import {
  Port,
  PortData,
} from 'reaflow';
import { PortProps } from 'reaflow/dist/symbols/Port/Port';
import {
  DragEvent,
  Position,
} from 'reaflow/dist/utils/useNodeDrag';
import { useRecoilState } from 'recoil';
import settings from '../../settings';
import { blockPickerMenuState } from '../../states/blockPickerMenuState';
import { draggedEdgeFromPortState } from '../../states/draggedEdgeFromPortState';
import { edgesState } from '../../states/edgesState';
import { nodesState } from '../../states/nodesState';
import BaseNodeData from '../../types/BaseNodeData';
import BaseNodeType from '../../types/BaseNodeType';
import BasePortData from '../../types/BasePortData';
import BlockPickerMenuState, { OnBlockClick } from '../../types/BlockPickerMenu';
import {
  addNodeAndEdgeThroughPorts,
  createNodeFromDefaultProps,
} from '../../utils/nodes';
import InformationNode from '../nodes/InformationNode';
import QuestionNode from '../nodes/QuestionNode';

type Props = {
  fromNodeId: string;
} & Partial<PortProps>;

const BasePort: React.FunctionComponent<Props> = (props) => {
  const {
    fromNodeId,
    onDragEnd: onDragEndInternal,
    ...rest
  } = props;

  const [blockPickerMenu, setBlockPickerMenu] = useRecoilState<BlockPickerMenuState>(blockPickerMenuState);
  const [nodes, setNodes] = useRecoilState(nodesState);
  const [edges, setEdges] = useRecoilState(edgesState);
  const [draggedEdgeFromPort, setDraggedEdgeFromPort] = useRecoilState(draggedEdgeFromPortState);
  const node: BaseNodeData = nodes.find((node) => node.id === fromNodeId) as BaseNodeData;

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
  const onBlockClick: OnBlockClick = (nodeType: BaseNodeType) => {
    console.log('onBlockClick (from port)', nodeType);
    const NodeComponent = nodeType === 'question' ? QuestionNode : InformationNode;
    const newNode = createNodeFromDefaultProps(NodeComponent.getDefaultNodeProps());
    const results = addNodeAndEdgeThroughPorts(cloneDeep(nodes), cloneDeep(edges), newNode, node);
    console.log('addNodeAndEdge fromNode', newNode, 'toNode', node, 'results', results);

    setNodes(results.nodes);
    setEdges(results.edges);
  };

  const onPortClick = (event: React.MouseEvent<SVGGElement, MouseEvent>, port: PortData) => {
    setBlockPickerMenu({
      isDisplayed: true, // Toggle on click XXX change later, should toggle but not easy to test when toggle is on
      onBlockClick,
    });
  };

  const onDragStart = (event: DragEvent, fromPosition: Position, port: BasePortData, extra: any) => {
    console.log('onDragStart port: ', node, event, fromPosition, port, extra);

    setDraggedEdgeFromPort({
      fromNode: node,
      fromPort: port,
      fromPosition: fromPosition,
    });
  };

  const onDragEnd = (dragEvent: DragEvent, initial: Position, port: BasePortData, extra: any) => {
    const { xy, distance, event } = dragEvent;
    const [x, y] = xy;
    // @ts-ignore
    const { target } = event;
    console.log('onDragEnd port: ', node, dragEvent, initial, port, extra);
    console.log('at position', xy);
    console.log('draggedEdgeFromPort', draggedEdgeFromPort);
    console.log('target', target);

    // Open the block picker menu below the clicked element
    setBlockPickerMenu({
      isDisplayed: true, // Toggle on click XXX change later, should toggle but not easy to test when toggle is on
      onBlockClick,
      // Depending on the position of the canvas, you might need to deduce from x/y some delta
      left: x, // No delta, because the canvas takes the full page width
      top: y - settings.layout.nav.height, // Some delta, because the canvas is not at the top of the page, but below the header
    });

    if (onDragEndInternal) {
      // Runs internal onDragEnd which removes the edge if it doesn't connect to anything
      onDragEndInternal(dragEvent, initial, port, extra);
    }

    // Reset the edge being dragged
    setDraggedEdgeFromPort(undefined);
  };

  const onPortEnter = (event: React.MouseEvent<SVGGElement, MouseEvent>, port: PortData) => {
    // console.log('onEnter port: ', node, event);
  };

  const onPortLeave = (event: React.MouseEvent<SVGGElement, MouseEvent>, port: PortData) => {
    // console.log('onLeave port: ', node, event);
  };

  return (
    <Port
      {...rest}
      onClick={onPortClick}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onEnter={onPortEnter}
      onLeave={onPortLeave}
      style={style}
      rx={settings.canvas.ports.radius}
      ry={settings.canvas.ports.radius}
    />
  );
};

export default BasePort;
