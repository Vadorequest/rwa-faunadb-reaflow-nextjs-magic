import classnames from 'classnames';
import cloneDeep from 'lodash.clonedeep';
import remove from 'lodash.remove';
import React from 'react';
import {
  NodeProps,
  Remove,
} from 'reaflow';
import { NodeData } from 'reaflow/dist/types';
import { useRecoilState } from 'recoil';
import useSelected from '../../hooks/useSelected';
import { blockPickerMenuState } from '../../states/blockPickerMenuState';
import { canvasDatasetSelector } from '../../states/canvasDatasetSelector';
import { nodesSelector } from '../../states/nodesState';
import { selectedState } from '../../states/selectedState';
import BaseNodeData from '../../types/BaseNodeData';
import BaseNodeProps, { PatchCurrentNode } from '../../types/BaseNodeProps';
import { CanvasDataset } from '../../types/CanvasDataset';
import NodeType from '../../types/NodeType';
import {
  findNodeComponentByType,
  removeAndUpsertNodesThroughPorts,
} from '../../utils/nodes';
import BasePort from '../ports/BasePort';

type Props = {
  nodeProps: NodeProps;
  lastCreatedNode: BaseNodeData | undefined;
}

/**
 * Node router.
 *
 * Acts as a router between node layouts, by rendering a different node layout, depending on the node "type".
 */
const NodeRouter: React.FunctionComponent<Props> = (props) => {
  const {
    nodeProps,
    lastCreatedNode,
  } = props;
  const [blockPickerMenu, setBlockPickerMenu] = useRecoilState(blockPickerMenuState);
  const [nodes, setNodes] = useRecoilState(nodesSelector);
  const [canvasDataset, setCanvasDataset] = useRecoilState(canvasDatasetSelector);
  const { edges } = canvasDataset;
  const [selected] = useRecoilState(selectedState);
  const {
    setSelections,
    onSelectionClick,
    onSelectionKeyDown,
  } = useSelected();
  const node: BaseNodeData = nodes.find((node: BaseNodeData) => node.id === nodeProps.id) as BaseNodeData;

  // console.log('router nodes', props);
  // console.log('node', node);

  const { properties } = nodeProps || {};
  const { data } = properties || {};
  const { type }: { type: NodeType } = data || {};

  if (!type) {
    try {
      console.error(`Node with type="${type}" couldn't be rendered. Properties: ${JSON.stringify(properties, null, 2)}`);
    } catch (e) {
      console.error(`Node with type="${type}" couldn't be rendered. Properties cannot be stringified.`);
    }

    return null;
  }

  /**
   * Path the properties of the current node.
   *
   * Only updates the provided properties, doesn't update other properties.
   * Also merges the 'data' object, by keeping existing data and only overwriting those that are specified.
   *
   * @param patch
   */
  const patchCurrentNode: PatchCurrentNode = (patch: Partial<BaseNodeData>): void => {
    const nodeToUpdateIndex = nodes.findIndex((node: BaseNodeData) => node.id === nodeProps.id);
    const existingNode: BaseNodeData = nodes[nodeToUpdateIndex];
    const nodeToUpdate = {
      ...existingNode,
      ...patch,
      data: {
        ...existingNode.data || {},
        ...patch.data || {},
      },
      id: existingNode.id, // Force keep same id to avoid edge cases
    };
    console.log('patchCurrentNode before', existingNode, 'after:', nodeToUpdate, 'using patch:', patch);

    const newNodes = cloneDeep(nodes);
    // @ts-ignore
    newNodes[nodeToUpdateIndex] = nodeToUpdate;

    setNodes(newNodes);
  };

  /**
   * Removes a node.
   *
   * Upsert its descendant if there were any. (auto-link all descendants to all its ascendants)
   *
   * Triggered when clicking on the "x" remove button that appears when a node is selected.
   *
   * @param event
   * @param node
   */
  const onNodeRemove = (event: React.MouseEvent<SVGGElement, MouseEvent>, node: NodeData) => {
    console.log('onNodeRemove', event, node);
    const dataset: CanvasDataset = removeAndUpsertNodesThroughPorts(nodes, edges, node);
    const newSelected = remove(selected, node?.id);

    setCanvasDataset(dataset);

    console.log('onNodeRemove newSelected', newSelected);
    // Updates selected nodes to make sure we don't keep selected nodes that have been deleted
    setSelections(newSelected);

    // Hide the block picker menu.
    // Forces to reset the function bound to onBlockClick. Necessary when there is one or none node left.
    setBlockPickerMenu({
      isDisplayed: false,
    });
  };

  /**
   * Selects the node when clicking on it.
   *
   * XXX We're resolving the "node" ourselves, instead of relying on the 2nd argument (nodeData),
   *  which might return null depending on where in the node the click was performed.
   *
   * @param event
   * @param data
   */
  const onNodeClick = (event: React.MouseEvent<SVGGElement, MouseEvent>, data: BaseNodeData) => {
    console.log('onNodeClick data', data);
    const node: BaseNodeData = nodes.find((node: BaseNodeData) => node.id === nodeProps?.id) as BaseNodeData;
    console.log(`node clicked (${nodeProps?.properties?.text || nodeProps?.id})`, nodeProps);
    console.log(`node selected`, node);

    onSelectionClick(event, node);
  };

  /**
   * When the mouse enters a node (on hover).
   *
   * XXX Does not work well because `foreignObject` is displayed on top of the Node. See https://github.com/reaviz/reaflow/issues/45
   *
   * @param event
   * @param node
   */
  const onNodeEnter = (event: React.MouseEvent<SVGGElement, MouseEvent>, node: BaseNodeData) => {

  };

  /**
   * When the mouse leaves a node (leaves hover area).
   *
   * XXX Does not work well because `foreignObject` is displayed on top of the Node. See https://github.com/reaviz/reaflow/issues/45
   *
   * @param event
   * @param node
   */
  const onNodeLeave = (event: React.MouseEvent<SVGGElement, MouseEvent>, node: BaseNodeData) => {

  };

  /**
   * Node props applied to all nodes, no matter what type they are.
   */
  const baseNodeProps: BaseNodeProps = {
    ...nodeProps,
    node,
    patchCurrentNode: patchCurrentNode,
    lastCreatedNode,
    isSelected: false, // TODO implement
    className: classnames(
      `node-svg-rect node-${type}-svg-rect`,
    ),
    style: {
      strokeWidth: 0,
      fill: 'white',
      color: 'black',
    },
    port: (
      <BasePort fromNodeId={nodeProps.id} />
    ),
    onClick: onNodeClick,
    onEnter: onNodeEnter,
    onLeave: onNodeLeave,
    onRemove: onNodeRemove,
    onKeyDown: onSelectionKeyDown,
    remove: (<Remove /*hidden={true}*/ />),
  };

  // console.log('rendering node of type: ', type, commonBlockProps)
  const NodeComponent = findNodeComponentByType(type);

  return (
    <NodeComponent
      {...baseNodeProps}
    />
  );
};

export default NodeRouter;
