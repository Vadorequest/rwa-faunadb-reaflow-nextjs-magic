import React, { Fragment } from 'react';
import { TextareaHeightChangeMeta } from 'react-textarea-autosize/dist/declarations/src';
import { NodeChildProps } from 'reaflow';
import BaseNodeComponent from '../../types/BaseNodeComponent';
import { BaseNodeDefaultProps } from '../../types/BaseNodeDefaultProps';
import BaseNodeProps from '../../types/BaseNodeProps';
import BaseNodeType from '../../types/BaseNodeType';
import Textarea from '../plugins/Textarea';
import BaseNode from './BaseNode';

type Props = {} & BaseNodeProps;

const nodeType: BaseNodeType = 'information';
const defaultWidth = 200;
const defaultHeight = 100;

const InformationNode: BaseNodeComponent<Props> = (props) => {
  const {
    updateCurrentNode,
    ...rest
  } = props;
  const {
    onClick,
  } = props;

  return (
    <BaseNode
      nodeType={nodeType}
      {...rest}
    >
      {
        (nodeProps: NodeChildProps) => {
          const {
            width,
            height,
          } = nodeProps;

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
            <Fragment>
              <div
                className={'node-header information-header'}
              >
                Information
              </div>

              <div
                className={'information-text-contained'}
              >
                <Textarea
                  className={'textarea information-text'}
                  defaultValue={`Say something here`}
                  placeholder={'Say something here'}
                  onHeightChange={onHeightChange}
                />
              </div>
            </Fragment>
          );
        }
      }
    </BaseNode>
  );
};
InformationNode.getDefaultNodeProps = (): BaseNodeDefaultProps => {
  return {
    type: nodeType,
    defaultWidth: defaultWidth,
    defaultHeight: defaultHeight,
    // @ts-ignore
    ports: BaseNode.getDefaultPorts(),
  };
};

export default InformationNode;
