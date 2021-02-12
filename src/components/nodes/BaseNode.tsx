import { css } from '@emotion/react';
import React, {
  MouseEventHandler,
  ReactNode,
} from 'react';
import {
  Node,
  NodeChildProps,
  PortData,
} from 'reaflow';
import settings from '../../settings';
import BaseNodeComponent from '../../types/BaseNodeComponent';
import { BaseNodeDefaultProps } from '../../types/BaseNodeDefaultProps';
import BaseNodeProps from '../../types/BaseNodeProps';
import { GetBaseNodeDefaultPropsProps } from '../../types/GetBaseNodeDefaultProps';
import NodeType from '../../types/NodeType';
import { createPort } from '../../utils/ports';

type Props = BaseNodeProps & {
  nodeType: NodeType;
};

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
    nodeType,
    children,
    ...rest
  } = props;
  const {
    onClick,
  } = props;

  return (
    <Node
      {...rest}
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

          return (
            <foreignObject
              className={`${nodeType}-node-container node-container`}
              width={width}
              height={height}
              x={0}
              y={0}
              css={css`
                position: relative;

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
              onClick={onClick as MouseEventHandler}
            >
              <div
                className={`${nodeType}-node node`}
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
                    typeof children === 'function' ? (children({ nodeProps }) as (node: NodeChildProps) => ReactNode) : children
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
BaseNode.getDefaultPorts = (): PortData[] => {
  return [
    createPort({
      height: settings.canvas.ports.radius,
      width: settings.canvas.ports.radius,
      alignment: 'CENTER',
      side: 'EAST',
    }),
    createPort({
      height: settings.canvas.ports.radius,
      width: settings.canvas.ports.radius,
      alignment: 'CENTER',
      side: 'WEST',
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
