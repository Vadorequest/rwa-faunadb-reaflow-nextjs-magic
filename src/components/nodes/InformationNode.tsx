import { css } from '@emotion/react';
import React, {
  KeyboardEventHandler,
  MouseEventHandler,
} from 'react';
import { TextareaHeightChangeMeta } from 'react-textarea-autosize/dist/declarations/src';
import {
  Node,
  PortData,
} from 'reaflow';
import settings from '../../settings';
import BaseNodeComponent from '../../types/BaseNodeComponent';
import BaseNodeData from '../../types/BaseNodeData';
import { BaseNodeDefaultProps } from '../../types/BaseNodeDefaultProps';
import BaseNodeProps from '../../types/BaseNodeProps';
import { createPort } from '../../utils/ports';
import Textarea from '../plugins/Textarea';

type Props = {
  updateCurrentNode?: (nodeData: Partial<BaseNodeData>) => void;
} & BaseNodeProps;

const defaultWidth = 200;
const defaultHeight = 100;

const InformationNode: BaseNodeComponent<Props> = (props) => {
  const {
    updateCurrentNode,
    ...rest
  } = props;
  const {
    onClick,
    onKeyDown,
  } = props;

  return (
    <Node
      {...rest}
    >
      {
        (event) => {
          // console.log('event ...rest', rest);
          // console.log('event', event);

          const {
            width,
            height,
          } = event;

          /**
           * When textarea input height changes, we need to increase the height of the element accordingly.
           *
           * @param height
           * @param meta
           */
          const onHeightChange = (height: number, meta: TextareaHeightChangeMeta) => {
            // Only consider additional height, by ignoring the height of the first row
            const additionalHeight = height - meta.rowHeight;

            if (updateCurrentNode) {
              updateCurrentNode({
                height: defaultHeight + additionalHeight,
              });
            }
          };

          return (
            <foreignObject
              className={'information-node-container node-container'}
              width={width}
              height={height}
              x={0}
              y={0}
              onClick={onClick as MouseEventHandler}
              onKeyDown={onKeyDown as KeyboardEventHandler}
              css={css`
                pointer-events: none;

                div:not(&.node) {
                  pointer-events: auto;
                }

                .node {
                  margin: 5px;
                }

                .information-text {
                  margin-top: 15px;
                  background-color: #eaeaea;
                }
              `}
            >
              <div
                className={'information-node node'}
                onClick={onClick as MouseEventHandler}
                onKeyDown={onKeyDown as KeyboardEventHandler}
              >
                <div
                  className={'node-header information-header'}
                >
                  Information
                </div>

                <div
                  className={'question-text-contained'}
                >
                  <Textarea
                    className={'information-text'}
                    defaultValue={`Say something here`}
                    placeholder={'Say something here'}
                    onHeightChange={onHeightChange}
                  />
                </div>
              </div>
            </foreignObject>
          );
        }
      }
    </Node>
  );
};
InformationNode.getDefaultNodeProps = (): BaseNodeDefaultProps => {
  return {
    type: 'information',
    defaultWidth: defaultWidth,
    defaultHeight: defaultHeight,
    // @ts-ignore
    ports: InformationNode.getDefaultPorts(),
  };
};
InformationNode.getDefaultPorts = (): PortData[] => {
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

export default InformationNode;
