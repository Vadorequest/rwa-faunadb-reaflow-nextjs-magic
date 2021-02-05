import cloneDeep from 'lodash.clonedeep';
import React from 'react';
import {
  addNodeAndEdge,
  Port,
} from 'reaflow';
import { PortProps } from 'reaflow/dist/symbols/Port/Port';
import { useRecoilState } from 'recoil';
import { blockPickerMenuState } from '../../states/blockPickerMenuState';
import { edgesState } from '../../states/edgesState';
import { nodesState } from '../../states/nodesState';
import BaseNodeType from '../../types/BaseNodeType';
import BlockPickerMenuState, { OnBlockClick } from '../../types/BlockPickerMenu';
import { createNodeFromDefaultProps } from '../../utils/nodes';
import InformationNode from '../nodes/InformationNode';
import QuestionNode from '../nodes/QuestionNode';

type Props = {
  fromNodeId: string;
} & Partial<PortProps>;

const BasePort: React.FunctionComponent<Props> = (props) => {
  const { fromNodeId, ...rest } = props;

  const [blockPickerMenu, setBlockPickerMenu] = useRecoilState<BlockPickerMenuState>(blockPickerMenuState);
  const [nodes, setNodes] = useRecoilState(nodesState);
  const [edges, setEdges] = useRecoilState(edgesState);

  return (
    <Port
      onClick={(e, node) => {
        const onBlockClick: OnBlockClick = (nodeType: BaseNodeType) => {
          console.log('onBlockClick', nodeType);
          const NodeComponent = nodeType === 'question' ? QuestionNode : InformationNode;
          const newNode = createNodeFromDefaultProps(NodeComponent.getDefaultNodeProps());
          const results = addNodeAndEdge(cloneDeep(nodes), cloneDeep(edges), newNode, { id: fromNodeId as string });

          setNodes(results.nodes);
          setEdges(results.edges);
        };

        setBlockPickerMenu({
          isDisplayed: !blockPickerMenu.isDisplayed, // Toggle on click
          onBlockClick,
        });
      }}
      onEnter={(e, node) => {
        console.log('onEnter port: ', node);
      }}
      onLeave={(e, node) => {
        console.log('onLeave port: ', node);
      }}
      style={{ fill: 'white', stroke: 'white' }}
      rx={15}
      ry={15}
      {...rest}
    />
  );
};

export default BasePort;
