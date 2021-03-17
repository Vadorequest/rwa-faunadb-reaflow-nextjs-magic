import React, { Fragment } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { TextareaHeightChangeMeta } from 'react-textarea-autosize/dist/declarations/src';
import settings from '../../settings';
import BaseNodeComponent from '../../types/BaseNodeComponent';
import { BaseNodeDefaultProps } from '../../types/BaseNodeDefaultProps';
import BaseNodeProps from '../../types/BaseNodeProps';
import { InformationNodeAdditionalData } from '../../types/nodes/InformationNodeAdditionalData';
import { InformationNodeData } from '../../types/nodes/InformationNodeData';
import { SpecializedNodeProps } from '../../types/nodes/SpecializedNodeProps';
import NodeType from '../../types/NodeType';
import { isYoungerThan } from '../../utils/date';
import Textarea from '../plugins/Textarea';
import BaseNode from './BaseNode';

type Props = {} & BaseNodeProps<InformationNodeData>;

const nodeType: NodeType = 'information';
const baseWidth = 200;
const baseHeight = 100;

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
      baseWidth={baseWidth}
      baseHeight={baseHeight}
      {...props}
    >
      {
        (nodeProps: SpecializedNodeProps<InformationNodeData>) => {
          const {
            node,
            lastCreated,
            patchCurrentNode,
          } = nodeProps;
          const lastCreatedNode = lastCreated?.node;
          const lastCreatedAt = lastCreated?.at;

          // Autofocus works fine when the node is inside the viewport, but when it's created outside it moves the viewport back at the beginning
          const shouldAutofocus = false && lastCreatedNode?.id === node.id && isYoungerThan(lastCreatedAt, 1000);

          /**
           * Calculates the node's height based on the dynamic source that affect the dynamic height of the component.
           *
           * @param dynHeights
           */
          const calculateNodeHeight = (dynHeights?: InformationNodeAdditionalData['dynHeights']): number => {
            return (dynHeights?.baseHeight || baseHeight) +
              (dynHeights?.informationTextareaHeight || 0);
          };

          /**
           * When textarea input height changes, we need to increase the height of the whole node accordingly.
           *
           * @param height
           * @param meta
           */
          const onInformationTextHeightChange = (height: number, meta: TextareaHeightChangeMeta) => {
            // Only consider additional height, by ignoring the height of the first row
            const additionalHeight = height - meta.rowHeight;
            const patchedNodeAdditionalData: Partial<InformationNodeAdditionalData> = {
              dynHeights: {
                informationTextareaHeight: additionalHeight,
              } as InformationNodeAdditionalData['dynHeights'],
            };
            const newHeight = calculateNodeHeight(patchedNodeAdditionalData.dynHeights);
            console.log('onTextHeightChange ', node?.data?.dynHeights?.informationTextareaHeight, newHeight, node?.data?.dynHeights?.informationTextareaHeight !== newHeight);

            if (node?.data?.dynHeights?.informationTextareaHeight !== newHeight) {
              console.log('onTextHeightChange updating height')
              // Updates the value in the Recoil store
              patchCurrentNode({
                data: patchedNodeAdditionalData,
                height: newHeight,
              } as InformationNodeData);
            }
          };

          /**
           * Updates the current node "text" value.
           *
           * @param event
           */
          const onInformationTextInputValueChange = (event: any) => {
            const newValue = event.target.value;

            if (newValue !== node?.data?.informationText) {
              // Updates the value in the Recoil store
              patchCurrentNode({
                data: {
                  informationText: newValue,
                },
              } as InformationNodeData);
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
                <DebounceInput
                  // @ts-ignore
                  element={Textarea}
                  debounceTimeout={settings.canvas.nodes.defaultDebounceWaitFor} // Avoids making the Canvas "lag" due to many unnecessary re-renders, by applying input changes in batches (one at most every 500ms)
                  className={`textarea ${nodeType}-text`}
                  placeholder={'Say something here'}
                  onHeightChange={onInformationTextHeightChange}
                  onChange={onInformationTextInputValueChange}
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
    baseWidth: baseWidth,
    baseHeight: baseHeight,
    // @ts-ignore
    ports: BaseNode.getDefaultPorts(),
  };
};

export default InformationNode;
