import React, { Fragment } from 'react';
import { TextareaHeightChangeMeta } from 'react-textarea-autosize/dist/declarations/src';
import { NodeChildProps } from 'reaflow';
import BaseNodeComponent from '../../types/BaseNodeComponent';
import { BaseNodeDefaultProps } from '../../types/BaseNodeDefaultProps';
import BaseNodeProps from '../../types/BaseNodeProps';
import NodeType from '../../types/NodeType';
import Textarea from '../plugins/Textarea';
import BaseNode from './BaseNode';

type Props = {} & BaseNodeProps;

const nodeType: NodeType = 'information';
const defaultWidth = 200;
const defaultHeight = 100;

/**
 * Information node.
 *
 * Used to display an information (as text).
 *
 * Displays a multi lines text input. (textarea)
 * Has one west port and one east port.
 * The west port allows unlimited links to other nodes.
 * The east port allows only one link to another node. (TODO not enforced yet)
 */
const InformationNode: BaseNodeComponent<Props> = (props) => {
  const {
    updateCurrentNode,
    ...rest
  } = props;
  const {
    id,
    lastCreatedNode,
  } = props;

  return (
    <BaseNode
      nodeType={nodeType}
      {...rest}
    >
      {
        ({ nodeProps }: { nodeProps: NodeChildProps }) => {
          /**
           * When textarea input height changes, we need to increase the height of the whole node accordingly.
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
                className={`node-header ${nodeType}-header`}
              >
                Information
              </div>

              <div
                className={`node-content ${nodeType}-content`}
              >
                <Textarea
                  className={`textarea ${nodeType}-text`}
                  defaultValue={`Say something here`}
                  placeholder={'Say something here'}
                  onHeightChange={onHeightChange}
                  // autoFocus={lastCreatedNode?.id === id} // Autofocus works fine when the node is inside the viewport, but when it's created outside it moves the viewport back at the beginning
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
