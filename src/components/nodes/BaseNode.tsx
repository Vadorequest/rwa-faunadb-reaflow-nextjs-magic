import { css } from '@emotion/react';
import React, { MouseEventHandler } from 'react';
import {
  Node,
  PortData,
} from 'reaflow';
import settings from '../../settings';
import BaseNodeComponent from '../../types/BaseNodeComponent';
import { BaseNodeDefaultProps } from '../../types/BaseNodeDefaultProps';
import BaseNodeProps from '../../types/BaseNodeProps';
import BaseNodeType from '../../types/BaseNodeType';
import { GetBaseNodeDefaultPropsProps } from '../../types/GetBaseNodeDefaultProps';
import { createPort } from '../../utils/ports';

type Props = BaseNodeProps & {
  nodeType: BaseNodeType;
};

const fallbackDefaultWidth = 200;
const fallbackDefaultHeight = 100;

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
        (event) => {
          const {
            width,
            height,
          } = event;
          console.log('event from baseNode', event);

          return (
            <foreignObject
              className={`${nodeType}-node-container node-container`}
              width={width}
              height={height}
              x={0}
              y={0}
              css={css`
                position: relative;
                pointer-events: none;

                div {
                  pointer-events: auto;
                }

                .node {
                  margin: 5px;
                }

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
                  className={'actions node-actions'}
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
                  `}
                >
                  <div
                    className={'delete-action'}
                  >
                    x
                  </div>
                </div>

                <div
                  className={`node-content ${nodeType}-content`}
                >
                  {
                    // @ts-ignore
                    children(event)
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
