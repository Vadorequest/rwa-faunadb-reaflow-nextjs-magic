import { css } from '@emotion/react';
import classnames from 'classnames';
import cloneDeep from 'lodash.clonedeep';
import remove from 'lodash.remove';
import React, { MouseEventHandler } from 'react';
import {
  Node,
  NodeChildProps,
  NodeData,
  Remove,
} from 'reaflow';
import { useRecoilState } from 'recoil';
import settings from '../../settings';
import { blockPickerMenuState } from '../../states/blockPickerMenuState';
import { canvasDatasetSelector } from '../../states/canvasDatasetSelector';
import { lastCreatedNodeState } from '../../states/lastCreatedNodeState';
import { nodesSelector } from '../../states/nodesState';
import { selectedNodesSelector } from '../../states/selectedNodesState';
import BaseNodeComponent from '../../types/BaseNodeComponent';
import BaseNodeData from '../../types/BaseNodeData';
import { BaseNodeDefaultProps } from '../../types/BaseNodeDefaultProps';
import BaseNodeProps, { PatchCurrentNode } from '../../types/BaseNodeProps';
import BasePortData from '../../types/BasePortData';
import { CanvasDataset } from '../../types/CanvasDataset';
import { GetBaseNodeDefaultPropsProps } from '../../types/GetBaseNodeDefaultProps';
import { SpecializedNodeProps } from '../../types/nodes/SpecializedNodeProps';
import NodeType from '../../types/NodeType';
import { removeAndUpsertNodesThroughPorts } from '../../utils/nodes';
import { createPort } from '../../utils/ports';
import BasePort from '../ports/BasePort';

type Props = BaseNodeProps & {};

const fallbackDefaultWidth = 200;
const fallbackDefaultHeight = 100;

/**
 * Base node component.
 *
 * This component contains shared business logic common to all nodes.
 * It renders a Reaflow <Node> component, which contains a <foreignObject> that allows us to write proper HTML/CSS within.
 *
 * The Node is rendered as SVG <rect> element.
 * Beware the <foreignObject> will appear "on top" of the <Node>, and thus the Node will not receive some events because they're caught by the <foreignObject>.
 *
 * XXX If you want to change the behavior of all nodes while avoid code duplication, here's the place.
 *
 * @see https://reaflow.dev/?path=/story/demos-nodes
 * @see https://github.com/reaviz/reaflow/issues/45 Using `foreignObject` "steals" all `Node` events (onEnter, etc.) - How to forward events when using foreignObject?
 * @see https://github.com/reaviz/reaflow/issues/50 `useSelection` hook `onKeyDown` event doesn't work with `foreignObject` - Multiple selection doesn't work when using a `foreignObject
 * @see https://github.com/reaviz/reaflow/issues/44 React select component displays/hides itself randomly (as `foreignObject`)
 */
const BaseNode: BaseNodeComponent<Props> = (props) => {
  const {
    children, // Don't forward, overridden in this file
    node, // Don't forward, not expected
    ...nodeProps // All props that are left will be forwarded to the Node component
  } = props;

  const [blockPickerMenu, setBlockPickerMenu] = useRecoilState(blockPickerMenuState);
  const [nodes, setNodes] = useRecoilState(nodesSelector);
  const [canvasDataset, setCanvasDataset] = useRecoilState(canvasDatasetSelector);
  const { edges } = canvasDataset;
  const [selectedNodes, setSelectedNodes] = useRecoilState(selectedNodesSelector);
  const isSelected = !!selectedNodes?.find((selectedNode: string) => selectedNode === node.id);
  const [lastCreatedNode] = useRecoilState(lastCreatedNodeState);
  const nodeType: NodeType = node?.data?.type as NodeType;

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
    const newSelectedNodes = remove(selectedNodes, node?.id);

    setCanvasDataset(dataset);

    // Updates selected nodes to make sure we don't keep selected nodes that have been deleted
    setSelectedNodes(newSelectedNodes);

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
   *  which might return null depending on where in the node the click was performed (because of the <foreignObject>).
   *
   * @param event
   * @param data_DO_NOT_USE
   */
  const onNodeClick = (event: React.MouseEvent<SVGGElement, MouseEvent>, data_DO_NOT_USE: BaseNodeData) => {
    console.log(`node clicked (${node?.data?.type})`, 'node:', node);
    setSelectedNodes([node.id]);
  };

  /**
   * When the mouse enters a node (on hover).
   *
   * @param event
   * @param node
   */
  const onNodeEnter = (event: React.MouseEvent<SVGGElement, MouseEvent>, node: BaseNodeData) => {

  };

  /**
   * When the mouse leaves a node (leaves hover area).
   *
   * @param event
   * @param node
   */
  const onNodeLeave = (event: React.MouseEvent<SVGGElement, MouseEvent>, node: BaseNodeData) => {

  };

  return (
    <Node
      {...nodeProps}
      style={{
        strokeWidth: 0,
        fill: 'white',
        color: 'black',
      }}
      className={classnames(
        `node-svg-rect node-${nodeType}-svg-rect`,
      )}
      onClick={onNodeClick}
      onEnter={onNodeEnter}
      onLeave={onNodeLeave}
      onRemove={onNodeRemove}
      remove={(<Remove hidden={true} />)}
      port={(<BasePort fromNodeId={node.id} />)}
    >
      {
        /**
         * Renders the foreignObject and common layout used by all nodes.
         *
         * XXX CSS styles applied here will be correctly applied to elements created in specialised node components.
         *
         * @param nodeProps
         */
        (nodeProps: NodeChildProps) => {
          const {
            width,
            height,
          } = nodeProps;
          const specializedNodeProps: SpecializedNodeProps = {
            ...nodeProps,
            patchCurrentNode,
            lastCreatedNode,
            isSelected,
          };

          return (
            <foreignObject
              className={classnames(`${nodeType}-node-container node-container`, { 'is-selected': isSelected })}
              width={width}
              height={height}
              x={0} // Relative position from the parent Node component (aligned to top)
              y={0} // Relative position from the parent Node component (aligned to left)
              css={css`
                position: relative;

                // Disabling pointer-events on top-level containers, for events to be forwarded to the underlying <rect>
                // Allows using events specific to the Reaflow <Node> component (onClick, onEnter, onLeave, etc.)
                pointer-events: none;

                &.is-selected {
                  border: 1px dashed blue;
                }

                .node,
                .node-header {
                  pointer-events: none;
                }

                .node-action,
                .node-content {
                  pointer-events: auto;
                }

                .node {
                  margin: 5px;

                  // XXX Elements within a <foreignObject> that are using the CSS "position" attribute won't be shown properly, 
                  //  unless they're wrapped into a container using a "fixed" position.
                  //  Solves the display of React Select element.
                  // See https://github.com/chakra-ui/chakra-ui/issues/3288#issuecomment-776316200
                  position: fixed;
                }

                // Applied to all textarea for all nodes
                .textarea {
                  margin-top: 15px;
                  background-color: #eaeaea;
                }
              `}
              // Use the same onClick/onMouseEnter/onMouseLeave handlers as the one used by the Node component, to yield the same behavior whether clicking on the <rect> or on the <foreignObject> element
              onClick={onNodeClick as MouseEventHandler}
              onMouseEnter={onNodeEnter as MouseEventHandler}
              onMouseLeave={onNodeLeave as MouseEventHandler}
            >
              <div
                className={classnames(`${nodeType}-node node`)}
              >
                <div
                  className={'node-actions-container'}
                  css={css`
                    position: absolute;
                    top: -15px;
                    right: 5px;
                    margin: 5px;
                    padding: 5px;
                    background-color: transparent;
                    color: red;
                    width: 5px;
                    height: 5px;

                    div {
                      cursor: pointer;
                    }

                    .delete-action {
                      display: none; // TODO implement
                    }
                  `}
                >
                  <div
                    className={'node-action delete-action'}
                  >
                    x
                  </div>
                </div>

                <div
                  className={`node-content-container ${nodeType}-content-container`}
                >
                  {
                    // Invoke the children as a function, or render the children as a component, if it's not a function
                    // @ts-ignore
                    typeof children === 'function' ? (children({ ...specializedNodeProps })) : children
                  }
                </div>
              </div>
            </foreignObject>
          );
        }
      }
    </Node>
  );
};

/**
 * By default, a node has 2 ports, one on the east side (left) and one on the west side (right).
 *
 * XXX The height/width properties must be set here because they're used for calculations of the port's placement.
 *  If we change them directly in the <Port|BasePort> component, the ports will be misaligned with the node.
 */
BaseNode.getDefaultPorts = (): BasePortData[] => {
  return [
    createPort({
      height: settings.canvas.ports.radius,
      width: settings.canvas.ports.radius,
      alignment: 'CENTER',
      side: 'WEST',
    }),
    createPort({
      height: settings.canvas.ports.radius,
      width: settings.canvas.ports.radius,
      alignment: 'CENTER',
      side: 'EAST',
    }),
  ];
};

/**
 * Builds the defaults properties of a node.
 *
 * Used when creating a new node.
 *
 * @param props
 */
BaseNode.getDefaultNodeProps = (props: GetBaseNodeDefaultPropsProps): BaseNodeDefaultProps => {
  const { type, defaultHeight, defaultWidth } = props;

  return {
    type,
    defaultWidth: defaultWidth || fallbackDefaultWidth,
    defaultHeight: defaultHeight || fallbackDefaultHeight,
    // @ts-ignore
    ports: BaseNode.getDefaultPorts(),
  };
};

export default BaseNode;
