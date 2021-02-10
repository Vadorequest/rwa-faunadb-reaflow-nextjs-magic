import cloneDeep from 'lodash.clonedeep';
import React from 'react';
import {
  Edge,
  EdgeData,
} from 'reaflow';
import { useRecoilState } from 'recoil';
import { blockPickerMenuState } from '../../states/blockPickerMenuState';
import { edgesState } from '../../states/edgesState';
import { nodesState } from '../../states/nodesState';
import BaseEdgeProps from '../../types/BaseEdgeProps';
import BaseNodeType from '../../types/BaseNodeType';
import BlockPickerMenu, { OnBlockClick } from '../../types/BlockPickerMenu';
import {
  createNodeFromDefaultProps,
  getDefaultNodePropsWithFallback,
  upsertNodeThroughPorts,
} from '../../utils/nodes';
import AddBlockPicker from '../blocks/AddBlockPicker';

type Props = {} & BaseEdgeProps;

/**
 * Base edge component.
 *
 * This component contains shared business logic common to all edges.
 * It renders a Reaflow <Edge> component.
 *
 * The Edge is rendered as SVG <g> wrapper, which contains the <path> that displays the link itself.
 */
const BaseEdge: React.FunctionComponent<Props> = (props) => {
  const [blockPickerMenu, setBlockPickerMenu] = useRecoilState<BlockPickerMenu>(blockPickerMenuState);
  const [nodes, setNodes] = useRecoilState(nodesState);
  const [edges, setEdges] = useRecoilState(edgesState);
  const { displayedFrom } = blockPickerMenu;

  // console.log('edgeProps', props);

  /**
   * Invoked when clicking on the "+" of the edge.
   *
   * Displays the BlockPickerMenu, which can then be used to select which Block to add to the canvas.
   * When a block is clicked, the "onBlockClick" function is invoked and creates (upserts) the node
   * by splitting the edge in two parts and adding the new node in between.
   *
   * @param event
   * @param edge
   */
  const onAdd = (event: React.MouseEvent<SVGGElement, MouseEvent>, edge: EdgeData): void => {
    console.log('onAdd edge', edge);
    const onBlockClick: OnBlockClick = (nodeType: BaseNodeType) => {
      console.log('onBlockClick', nodeType, edge);
      const newNode = createNodeFromDefaultProps(getDefaultNodePropsWithFallback(nodeType));
      const results = upsertNodeThroughPorts(cloneDeep(nodes), cloneDeep(edges), edge, newNode);

      setNodes(results.nodes);
      setEdges(results.edges);
    };

    setBlockPickerMenu({
      displayedFrom: `edge-${edge.id}`,
      // Toggles on click if the source is the same, otherwise update
      isDisplayed: displayedFrom === `edge-${edge.id}` ? !blockPickerMenu.isDisplayed : true,
      onBlockClick,
      eventTarget: event.target,
    });
  }

  return (
    <Edge
      {...props}
      label={(<div>Test</div>)}
      // labels={}
      className={'edge'}
      add={<AddBlockPicker />}
      onAdd={onAdd}
    />
  );
};

export default BaseEdge;
