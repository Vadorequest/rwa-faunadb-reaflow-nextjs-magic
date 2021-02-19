import classnames from 'classnames';
import cloneDeep from 'lodash.clonedeep';
import React from 'react';
import {
  Edge,
  EdgeData,
} from 'reaflow';
import {
  SetterOrUpdater,
  useRecoilState,
  useSetRecoilState,
} from 'recoil';
import { blockPickerMenuState } from '../../states/blockPickerMenuState';
import { canvasDatasetSelector } from '../../states/canvasDatasetSelector';
import { edgesSelector } from '../../states/edgesState';
import { lastCreatedNodeState } from '../../states/lastCreatedNodeState';
import { selectedEdgesSelector } from '../../states/selectedEdgesState';
import BaseEdgeData from '../../types/BaseEdgeData';
import BaseEdgeProps from '../../types/BaseEdgeProps';
import BaseNodeData from '../../types/BaseNodeData';
import BasePortData from '../../types/BasePortData';
import BlockPickerMenu, { OnBlockClick } from '../../types/BlockPickerMenu';
import { CanvasDataset } from '../../types/CanvasDataset';
import NodeType from '../../types/NodeType';
import { translateXYToCanvasPosition } from '../../utils/canvas';
import {
  createNodeFromDefaultProps,
  getDefaultNodePropsWithFallback,
  upsertNodeThroughPorts,
} from '../../utils/nodes';
import EdgeActions from './EdgeActions';

type Props = {} & BaseEdgeProps;

/**
 * Base edge component.
 *
 * This component contains shared business logic common to all edges.
 * It renders a Reaflow <Edge> component.
 *
 * The Edge is rendered as SVG <g> wrapper, which contains the <path> that displays the link itself.
 *
 * @see https://reaflow.dev/?path=/story/demos-edges
 */
const BaseEdge: React.FunctionComponent<Props> = (props) => {
  const {
    id,
    source: sourceNodeId,
    sourcePort: sourcePortId,
    target: targetNodeId,
    targetPort: targetPortId,
  } = props;

  const [blockPickerMenu, setBlockPickerMenu] = useRecoilState<BlockPickerMenu>(blockPickerMenuState);
  const [canvasDataset, setCanvasDataset] = useRecoilState(canvasDatasetSelector);
  const [edges, setEdges] = useRecoilState(edgesSelector);
  const [selectedEdges, setSelectedEdges] = useRecoilState(selectedEdgesSelector);
  const { nodes } = canvasDataset;
  const setLastUpdatedNode: SetterOrUpdater<BaseNodeData | undefined> = useSetRecoilState(lastCreatedNodeState);
  const { displayedFrom, isDisplayed } = blockPickerMenu;
  const edge: BaseEdgeData = edges.find((edge: BaseEdgeData) => edge?.id === id) as BaseEdgeData;

  if (typeof edge === 'undefined') {
    return null;
  }

  // Resolve instances of connected nodes and ports
  const sourceNode: BaseNodeData | undefined = nodes.find((node: BaseNodeData) => node.id === sourceNodeId);
  const sourcePort: BasePortData | undefined = sourceNode?.ports?.find((port: BasePortData) => port.id === sourcePortId);
  const targetNode: BaseNodeData | undefined = nodes.find((node: BaseNodeData) => node.id === targetNodeId);
  const targetPort: BasePortData | undefined = targetNode?.ports?.find((port: BasePortData) => port.id === targetPortId);
  const isSelected = !!selectedEdges?.find((selectedEdge: string) => selectedEdge === edge.id);

  // console.log('edgeProps', props);

  /**
   * Invoked when clicking on the "+" of the edge.
   *
   * Displays the BlockPickerMenu, which can then be used to select which Block to add to the canvas.
   * If the BlockPickerMenu was already displayed, hides it if it was opened from the same edge.
   *
   * When a block is clicked, the "onBlockClick" function is invoked and creates (upserts) the node
   * by splitting the edge in two parts and adding the new node in between.
   *
   * @param event
   * @param edge
   */
  const onAddIconClick = (event: React.MouseEvent<SVGGElement, MouseEvent>, edge_DO_NOT_USE: EdgeData): void => {
    console.log('onAdd edge', edge, event);
    const onBlockClick: OnBlockClick = (nodeType: NodeType) => {
      console.log('onBlockClick (from edge add)', nodeType, edge);
      const newNode: BaseNodeData = createNodeFromDefaultProps(getDefaultNodePropsWithFallback(nodeType));
      const newDataset: CanvasDataset = upsertNodeThroughPorts(cloneDeep(nodes), cloneDeep(edges), edge, newNode);

      setCanvasDataset(newDataset);
      setLastUpdatedNode(newNode);
    };

    // Converts the x/y position to a Canvas position and apply some margin for the BlockPickerMenu to display on the right bottom of the cursor
    const [x, y] = translateXYToCanvasPosition(event.clientX, event.clientY, { left: 15, top: 15 });

    setBlockPickerMenu({
      displayedFrom: `edge-${edge.id}`,
      // Toggles on click if the source is the same, otherwise update
      isDisplayed: displayedFrom === `edge-${edge.id}` ? !isDisplayed : true,
      onBlockClick,
      eventTarget: event.target,
      top: y,
      left: x,
    });
  };

  const onRemoveIconClick = (event: React.MouseEvent<SVGGElement, MouseEvent>, edge: EdgeData): void => {
    console.log('onRemoveIconClick', event, edge);
    setEdges(edges.filter((edge: BaseEdgeData) => edge.id !== id));
  };

  /**
   * Selects the edge when clicking on it.
   *
   * XXX We're resolving the "edge" ourselves, instead of relying on the 2nd argument (edgeData),
   *  which doesn't contain all the expected properties. It is more reliable to use the current edge, which already known.
   *
   * @param event
   * @param data_DO_NOT_USE
   */
  const onEdgeClick = (event: React.MouseEvent<SVGGElement, MouseEvent>, data_DO_NOT_USE: BaseEdgeData) => {
    console.log('onEdgeClick', event, edge);
    setSelectedEdges([edge.id]);
  };

  return (
    <Edge
      {...props}
      className={classnames(`edge`, { 'is-selected': isSelected })}
      add={(
        <EdgeActions
          hidden={!isSelected}
          onAdd={onAddIconClick}
          onRemove={onRemoveIconClick}
        />
      )}
      onClick={onEdgeClick}
    />
    // Doesn't support children - See https://github.com/reaviz/reaflow/issues/67
    // Possible to use a custom children to achieve this, but not great DX because of manual x/y placement
    /*
      <foreignObject
        width={30}
        height={30}
        // x={1272}
        // y={231}
        css={css`
          position: absolute;
          //left: 1272px;
          //top: 231px;
          color: black;
        `}
      >
        test
      </foreignObject>
    * */
  );
};

export default BaseEdge;
