import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import cloneDeep from 'lodash.clonedeep';
import remove from 'lodash.remove';
import React, {
  KeyboardEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from 'react';
import {
  Node,
  NodeChildProps,
  Remove,
} from 'reaflow';
import { useRecoilState } from 'recoil';
import settings from '../../settings';
import { blockPickerMenuSelector } from '../../states/blockPickerMenuState';
import { canvasDatasetSelector } from '../../states/canvasDatasetSelector';
import { lastCreatedState } from '../../states/lastCreatedState';
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
import { isYoungerThan } from '../../utils/date';
import {
  cloneNode,
  isNodeReachable,
  removeAndUpsertNodesThroughPorts,
} from '../../utils/nodes';
import { createPort } from '../../utils/ports';
import BasePort from '../ports/BasePort';

type Props = BaseNodeProps & {
  hasCloneAction?: boolean;
  hasDeleteAction?: boolean;
};

const fallbackDefaultWidth = 200;
const fallbackDefaultHeight = 100;

/**
 * Base node component.
 *
 * This component contains shared business logic common to all nodes.
 * It renders a Reaflow <Node> component, which contains a <foreignObject> HTML element that allows us to write advanced HTML elements within.
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
 * TODO link doc about foreignObject - awaiting https://github.com/reaviz/reaflow/pull/74
 */
const BaseNode: BaseNodeComponent<Props> = (props) => {
  const {
    children, // Don't forward, overridden in this file
    node, // Don't forward, not expected
    hasCloneAction = true, // Don't forward, not expected
    hasDeleteAction = true, // Don't forward, not expected
    ...nodeProps // All props that are left will be forwarded to the Node component
  } = props;

  const [blockPickerMenu, setBlockPickerMenu] = useRecoilState(blockPickerMenuSelector);
  const [nodes, setNodes] = useRecoilState(nodesSelector);
  const [canvasDataset, setCanvasDataset] = useRecoilState(canvasDatasetSelector);
  const { edges } = canvasDataset;
  const [selectedNodes, setSelectedNodes] = useRecoilState(selectedNodesSelector);
  const isSelected = !!selectedNodes?.find((selectedNode: string) => selectedNode === node.id);
  const nodeType: NodeType = node?.data?.type as NodeType;
  const isReachable = isNodeReachable(node, edges);
  const [lastCreated] = useRecoilState(lastCreatedState);
  const lastCreatedNode = lastCreated?.node;
  const lastCreatedAt = lastCreated?.at;
  const isLastCreatedNode = lastCreated?.node?.id === node?.id;

  const recentlyCreatedMaxAge = 5000; // TODO convert to settings
  // Used to highlight the last created node for a few seconds after it's been created, to make it easier to understand where it's located
  // Particularly useful to the editor when ELK changes the nodes position to avoid losing track of the node that was just created
  const [isRecentlyCreated, setIsRecentlyCreated] = useState<boolean>(isYoungerThan(lastCreatedAt, recentlyCreatedMaxAge));

  /**
   * Stops the highlight of the last created node when the node's age has reached max age.
   */
  useEffect(() => {
    if (isRecentlyCreated) {
      setTimeout(() => {
        setIsRecentlyCreated(false);
      }, recentlyCreatedMaxAge + 1);
    }
  }, []);

  /**
   * Path the properties of the current node.
   *
   * Only updates the provided properties, doesn't update other properties.
   * Also merges the 'data' object, by keeping existing data and only overwriting those that are specified.
   *
   * XXX Make sure to call this function once per function call, otherwise only the last patch call would be persisted correctly
   *  (multiple calls within the same function would be overridden by the last patch,
   *  because the "node" used as reference wouldn't be updated right away and would still use the same (outdated) reference)
   *  TLDR; Don't use "patchCurrentNode" multiple times in the same function, it won't work as expected
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
   * Clones the current node.
   *
   * @param event
   */
  const onNodeClone = (event: React.MouseEvent<SVGGElement, MouseEvent>) => {
    const clonedNode: BaseNodeData = cloneNode(node);
    console.log('clonedNode', clonedNode, nodes);

    setNodes([
      ...nodes,
      clonedNode,
    ]);
  };

  /**
   * Removes the current node.
   *
   * Upsert its descendant if there were any. (auto-link all descendants to all its ascendants)
   *
   * Triggered when clicking on the "x" remove button that appears when a node is selected.
   *
   * @param event
   */
  const onNodeRemove = (event: React.MouseEvent<SVGGElement, MouseEvent>) => {
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
   * Selects the current node when clicking on it.
   *
   * XXX We're resolving the "node" ourselves, instead of relying on the 2nd argument (nodeData),
   *  which might return null depending on where in the node the click was performed
   *  (because of the <foreignObject> which is displayed on top of the <rect> element and might hijack mouse events).
   *
   * @param event
   */
  const onNodeClick = (event: React.MouseEvent<SVGGElement, MouseEvent>) => {
    console.log(`node clicked (${node?.data?.type})`, 'node:', node);
    setSelectedNodes([node.id]);
  };

  /**
   * When the mouse enters a node (on hover).
   *
   * XXX Tried to detect when entering/leaving a node, but it's hard because of foreignObject which yields a lot of false positive events
   *  I couldn't reliably tell whether we're actually entering/leaving a node
   *  The goal was to to update mouseEnteredState accordingly, to know which node/port are currently being hovered/entered
   *  to bind node/ports in a reliable way when dropping an edge onto a node/port.
   *  But, our current implementation inf "BasePort.onPortDragEnd" (which relies on the DOM) is much more reliable.
   *
   * @param event
   * @param node
   */
  const onNodeEnter = (event: React.MouseEvent<SVGGElement, MouseEvent>, node: BaseNodeData) => {
    // console.log('onNodeEnter', event.target);

    // @ts-ignore
    // const isNode = event.target?.classList?.contains('node-svg-rect');
    // if (isNode) {
    //   // console.log('Entering node')
    // }
  };

  /**
   * When the mouse leaves a node (leaves hover area).
   *
   * XXX Tried to detect when entering/leaving a node, but it's hard because of foreignObject which yields a lot of false positive events
   *  I couldn't reliably tell whether we're actually entering/leaving a node
   *  The goal was to to update mouseEnteredState accordingly, to know which node/port are currently being hovered/entered
   *  to bind node/ports in a reliable way when dropping an edge onto a node/port.
   *  But, our current implementation inf "BasePort.onPortDragEnd" (which relies on the DOM) is much more reliable.
   *
   * @param event
   * @param node
   */
  const onNodeLeave = (event: React.MouseEvent<SVGGElement, MouseEvent>, node: BaseNodeData) => {
    // console.log('onNodeLeave', event.target);
    // console.log('containerRef?.current', containerRef?.current)

    // // @ts-ignore
    // const isChildrenOfNodeContainer = event.target?.closest('.node-container');
    // // @ts-ignore
    // const isChildrenOfNodeRect = event.target?.closest('.node-svg-rect');
    // const isNode = isChildrenOfNodeContainer || isChildrenOfNodeRect;
    //
    // if (isNode) {
    //   console.log('Hovering node')
    // }
  };

  /**
   * When a keyboard key is pressed/released.
   *
   * @param event
   * @param node
   */
  const onKeyDown = (event: React.KeyboardEvent<SVGGElement>, node: BaseNodeData) => {
    console.log('onKeyDown', event, node);
  };

  // console.log('BaseNode nodeProps', nodeProps);

  return (
    <Node
      {...nodeProps}
      style={{
        strokeWidth: 0,
        fill: isReachable ? 'white' : 'lightgray',
        color: 'black',
        cursor: 'auto',
      }}
      className={classnames(
        `node-svg-rect node-${nodeType}-svg-rect`,
      )}
      onClick={onNodeClick}
      onEnter={onNodeEnter}
      onLeave={onNodeLeave}
      onKeyDown={onKeyDown}
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
            isSelected,
            isReachable,
            lastCreated,
            patchCurrentNode,
          };

          return (
            <foreignObject
              id={`node-foreignObject-${node.id}`} // Used during drag & drop of edges to resolve the destination node ("toNode")
              className={classnames(`${nodeType}-node-container node-container`, {
                'is-selected': isSelected,
                'is-last-created': isLastCreatedNode,
                'is-recently-created': isRecentlyCreated,
              })}
              width={width}
              height={height}
              // x={0} // Relative position from the parent Node component (aligned to top)
              // y={0} // Relative position from the parent Node component (aligned to left)
              css={css`
                position: relative;
                transition: box-shadow 0.3s ease-in-out;
                
                &:hover{
                  box-shadow: 0px 5px 15px rgba(0, 40, 255, 0.2);
                  transition: box-shadow 0.3s ease-in-out;
                }
  
                // Highlights the node when it's being selected
                &.is-selected {
                  border: 2px solid ${settings.canvas.nodes.selected.borderColor};
                  border-radius: 2px;
                }

                // Highlights the node when it's the last created node
                &.is-recently-created {
                  animation: fadeIn ease-in-out 800ms;
                 
                    @keyframes fadeIn{
                      0% {
                        opacity:0;
                        box-shadow: 0px 5px 15px rgba(0, 40, 255, 1);
                      }
                      100% {
                        opacity:1;
                        box-shadow: 0px 5px 15px rgba(0, 40, 255, 0);
                      }
                    }
                }
                
                // Disabling pointer-events on top-level containers, for events to be forwarded to the underlying <rect>
                // Allows using events specific to the Reaflow <Node> component (onClick, onEnter, onLeave, etc.)
                pointer-events: none;

                .node,
                .node-header {
                  pointer-events: none;
                }

                .node-action,
                .node-content {
                  pointer-events: auto;
                }

                .node {
                  margin: 15px;

                  // XXX Elements within a <foreignObject> that are using the CSS "position" attribute won't be shown properly, 
                  //  unless they're wrapped into a container using a "fixed" position.
                  //  Solves the display of React Select element.
                  // See https://github.com/chakra-ui/chakra-ui/issues/3288#issuecomment-776316200
                  position: fixed;

                  // Take full size of its parent, minus the margins (left/right)
                  width: calc(100% - 30px); // Depends on above "margin" value
                  height: calc(100% - 30px); // Depends on above "margin" value
                }

                .is-unreachable-warning {
                  pointer-events: auto;
                  color: orange;
                  float: left;
                  cursor: help;
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
              onKeyDown={onKeyDown as KeyboardEventHandler}
            >
              <div
                className={classnames(`${nodeType}-node node`)}
              >
                <div
                  className={'node-actions-container'}
                  css={css`
                    position: absolute;
                    display: ${isSelected ? 'flex' : 'none'};
                    top: -15px;
                    right: ${(hasCloneAction ? 13 : 0) + (hasDeleteAction ? 13 : 0)}px; // Depends on how many actions needs to be displayed, currently hardcoded
                    margin: 5px;
                    padding: 5px;
                    background-color: transparent;
                    color: red;
                    width: 5px;
                    height: 5px;

                    .node-action {
                      cursor: pointer;
                    }
                  `}
                >
                  {
                    hasCloneAction && (
                      <div
                        className={'node-action delete-action'}
                        onClick={onNodeClone as MouseEventHandler}
                      >
                        <FontAwesomeIcon icon={['fas', 'clone']} />
                      </div>
                    )
                  }

                  {
                    hasDeleteAction && (
                      <div
                        className={'node-action delete-action'}
                        onClick={onNodeRemove as MouseEventHandler}
                      >
                        <FontAwesomeIcon icon={['fas', 'trash-alt']} />
                      </div>
                    )
                  }
                </div>

                <div
                  className={`node-content-container ${nodeType}-content-container`}
                >
                  {
                    // Displays a warning icon at the left of the node's title (using css float to avoid break line)
                    !isReachable && (
                      <span
                        className={'is-unreachable-warning'}
                      >
                        <FontAwesomeIcon
                          icon={['fas', 'exclamation-triangle']}
                          onClick={() => alert(`This node is not reachable because there are no edge connected to its entry port.`)}
                        />
                      </span>
                    )
                  }

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
    // nodePadding: 10 // TODO try it (left/top/bottom/right)
  };
};

export default BaseNode;
