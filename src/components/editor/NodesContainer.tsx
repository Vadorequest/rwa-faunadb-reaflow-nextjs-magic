import { css } from '@emotion/react';
import { motion } from 'framer-motion';
import { AnyPointerEvent } from 'framer-motion/types/gestures/PanSession';
import React from 'react';
import settings from '../../settings';
import BaseNodeComponent from '../../types/BaseNodeComponent';
import BaseNodeData from '../../types/BaseNodeData';
import { createNodeFromDefaultProps } from '../../utils/nodes';
import InformationNode from '../nodes/InformationNode';
import QuestionNode from '../nodes/QuestionNode';

type Props = {
  onNodeDragStart: (event: AnyPointerEvent, node: BaseNodeData) => void;
}

/**
 * Container of nodes.
 *
 * Each node can be clicked on drag and dropped, and will added into the Playground.
 */
const NodesContainer: React.FunctionComponent<Props> = (props): JSX.Element | null => {
  const {
    onNodeDragStart,
  } = props;

  const blockComponents: BaseNodeComponent[] = [
    InformationNode,
    QuestionNode,
  ];

  console.log('NodesContainer renders');

  return (
    <div
      className={'blocks-container'}
      css={css`
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        color: white;
        padding: 20px;
        display: flex;
        flex-direction: column;
        width: ${settings.blocksContainer.width};
        background-color: #f5f5f5;
        z-index: 1;

        .node {
          margin: 5px;
        }
      `}
    >
      {
        blockComponents.map((BlockComponent: BaseNodeComponent, index: number) => {
          const newNode = createNodeFromDefaultProps(BlockComponent.getDefaultNodeProps());

          return (
            <motion.div
              key={index}
              className="node"
              onMouseDown={(event) => {
                // @ts-ignore
                return onNodeDragStart(event, newNode);
              }}
            >
              <BlockComponent
                isPreview={true}
              />
            </motion.div>
          );
        })
      }
    </div>
  );
};

export default NodesContainer;
