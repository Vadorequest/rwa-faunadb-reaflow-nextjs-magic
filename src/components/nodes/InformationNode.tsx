import now from 'lodash.now';
import React, { Fragment } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { TextareaHeightChangeMeta } from 'react-textarea-autosize/dist/declarations/src';
import { useRecoilState } from 'recoil';
import { lastCreatedState } from '../../states/lastCreatedState';
import BaseNodeComponent from '../../types/BaseNodeComponent';
import { BaseNodeDefaultProps } from '../../types/BaseNodeDefaultProps';
import BaseNodeProps from '../../types/BaseNodeProps';
import { InformationNodeData } from '../../types/nodes/InformationNodeData';
import { SpecializedNodeProps } from '../../types/nodes/SpecializedNodeProps';
import NodeType from '../../types/NodeType';
import useCanvasUtils from '../hooks/useCanvasUtils';
import Textarea from '../plugins/Textarea';
import BaseNode from './BaseNode';

type Props = {} & BaseNodeProps<InformationNodeData>;

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
  return (
    <BaseNode
      {...props}
    >
      {
        (nodeProps: SpecializedNodeProps<InformationNodeData>) => {
          const {
            node,
            patchCurrentNode,
            x,
            y,
          } = nodeProps;
          console.log(props)
          const { setScrollXY } = useCanvasUtils();
          const [lastCreated] = useRecoilState(lastCreatedState);
          const lastCreatedNode = lastCreated?.node;
          const lastCreatedAt = lastCreated?.at;

          // Autofocus works fine when the node is inside the viewport, but when it's created outside it moves the viewport back at the beginning
          const shouldAutofocus = lastCreatedNode?.id === node.id && ((lastCreatedAt || 0) + 1000 > now());
          window.setScrollXY = setScrollXY;

          if (shouldAutofocus && typeof setScrollXY === 'function') {
            console.log('autocenter', x, y);
            // @ts-ignore
            // setScrollXY([x, y]);
          }

          /**
           * When textarea input height changes, we need to increase the height of the whole node accordingly.
           *
           * @param height
           * @param meta
           */
          const onTextHeightChange = (height: number, meta: TextareaHeightChangeMeta) => {
            // Only consider additional height, by ignoring the height of the first row
            const additionalHeight = height - meta.rowHeight;
            const newHeight: number = defaultHeight + additionalHeight;

            // Only update if the new height is different from the current height to avoid needless re-renders
            if (node.height !== newHeight) {
              patchCurrentNode({
                height: newHeight,
              });
            }
          };

          /**
           * Updates the current node "text" value.
           *
           * @param event
           */
          const onTextInputValueChange = (event: any) => {
            const newValue = event.target.value;

            // Updates the value in the Recoil store
            patchCurrentNode({
              data: {
                text: newValue,
              },
            } as InformationNodeData);
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
                <DebounceInput
                  // @ts-ignore
                  element={Textarea}
                  debounceTimeout={500} // Avoids making the Canvas "lag" due to many unnecessary re-renders, by applying input changes in batches (one at most every 500ms)
                  className={`textarea ${nodeType}-text`}
                  placeholder={'Say something here'}
                  onHeightChange={onTextHeightChange}
                  onChange={onTextInputValueChange}
                  value={node?.data?.text}
                  autoFocus={shouldAutofocus}
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
