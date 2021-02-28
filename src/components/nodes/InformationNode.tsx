import React, {
  Fragment,
  useEffect,
  useState,
} from 'react';
import { DebounceInput } from 'react-debounce-input';
import { TextareaHeightChangeMeta } from 'react-textarea-autosize/dist/declarations/src';
import BaseNodeComponent from '../../types/BaseNodeComponent';
import { BaseNodeDefaultProps } from '../../types/BaseNodeDefaultProps';
import BaseNodeProps from '../../types/BaseNodeProps';
import { InformationNodeData } from '../../types/nodes/InformationNodeData';
import { SpecializedNodeProps } from '../../types/nodes/SpecializedNodeProps';
import NodeType from '../../types/NodeType';
import { isYoungerThan } from '../../utils/date';
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
            lastCreated,
            patchCurrentNode,
          } = nodeProps;
          const [informationTextareaAdditionalHeight, setInformationTextareaAdditionalHeight] = useState<number>(0);
          const lastCreatedNode = lastCreated?.node;
          const lastCreatedAt = lastCreated?.at;

          // Autofocus works fine when the node is inside the viewport, but when it's created outside it moves the viewport back at the beginning
          const shouldAutofocus = false && lastCreatedNode?.id === node.id && isYoungerThan(lastCreatedAt, 1000);

          /**
           * Calculates the node's height dynamically.
           *
           * The node's height is dynamic and depends on various parameters (length of text, etc.).
           */
          useEffect(() => {
            const newHeight = defaultHeight + informationTextareaAdditionalHeight;

            // Only update the height if it's different
            if (node?.height !== newHeight) {
              patchCurrentNode({
                height: newHeight,
              });
            }
          }, [informationTextareaAdditionalHeight]);

          /**
           * When textarea input height changes, we need to increase the height of the whole node accordingly.
           *
           * @param height
           * @param meta
           */
          const onTextHeightChange = (height: number, meta: TextareaHeightChangeMeta) => {
            // Only consider additional height, by ignoring the height of the first row
            const additionalHeight = height - meta.rowHeight;

            if (informationTextareaAdditionalHeight !== additionalHeight) {
              setInformationTextareaAdditionalHeight(additionalHeight);
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
                informationText: newValue,
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
                  value={node?.data?.informationText}
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
