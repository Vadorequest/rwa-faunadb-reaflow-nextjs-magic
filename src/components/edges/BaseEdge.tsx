import cloneDeep from 'lodash.clonedeep';
import React from 'react';
import { Edge } from 'reaflow';
import { useRecoilState } from 'recoil';
import { blockPickerMenuState } from '../../states/blockPickerMenuState';
import { edgesState } from '../../states/edgesState';
import { nodesState } from '../../states/nodesState';
import BaseEdgeProps from '../../types/BaseEdgeProps';
import BaseNodeType from '../../types/BaseNodeType';
import BlockPickerMenu, { OnBlockClick } from '../../types/BlockPickerMenu';
import {
  createNodeFromDefaultProps,
  upsertNodeThroughPorts,
} from '../../utils/nodes';
import AddBlockPicker from '../blocks/AddBlockPicker';
import InformationNode from '../nodes/InformationNode';
import QuestionNode from '../nodes/QuestionNode';

type Props = {} & BaseEdgeProps;

const BaseEdge: React.FunctionComponent<Props> = (props) => {
  const [blockPickerMenu, setBlockPickerMenu] = useRecoilState<BlockPickerMenu>(blockPickerMenuState);
  const [nodes, setNodes] = useRecoilState(nodesState);
  const [edges, setEdges] = useRecoilState(edgesState);

  console.log('edgeProps', props);

  return (
    <Edge
      {...props}
      label={(<div>Test</div>)}
      // labels={}
      className={'edge'}
      add={<AddBlockPicker />}
      onAdd={(event, edge) => {
        console.log('onAdd edge', edge);
        const onBlockClick: OnBlockClick = (nodeType: BaseNodeType) => {
          console.log('onBlockClick', nodeType, edge);
          const NodeComponent = nodeType === 'question' ? QuestionNode : InformationNode;
          const newNode = createNodeFromDefaultProps(NodeComponent.getDefaultNodeProps());
          const results = upsertNodeThroughPorts(cloneDeep(nodes), cloneDeep(edges), edge, newNode);

          setNodes(results.nodes);
          setEdges(results.edges);
        };

        setBlockPickerMenu({
          isDisplayed: !blockPickerMenu.isDisplayed, // Toggle on click
          onBlockClick,
        });
      }}
    />
  );
};

export default BaseEdge;
