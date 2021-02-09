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
  getDefaultNodePropsWithFallback,
  upsertNodeThroughPorts,
} from '../../utils/nodes';
import AddBlockPicker from '../blocks/AddBlockPicker';

type Props = {} & BaseEdgeProps;

const BaseEdge: React.FunctionComponent<Props> = (props) => {
  const [blockPickerMenu, setBlockPickerMenu] = useRecoilState<BlockPickerMenu>(blockPickerMenuState);
  const [nodes, setNodes] = useRecoilState(nodesState);
  const [edges, setEdges] = useRecoilState(edgesState);

  const { displayedFrom } = blockPickerMenu;

  // console.log('edgeProps', props);

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
          const newNode = createNodeFromDefaultProps(getDefaultNodePropsWithFallback(nodeType));
          const results = upsertNodeThroughPorts(cloneDeep(nodes), cloneDeep(edges), edge, newNode);

          setNodes(results.nodes);
          setEdges(results.edges);
        };

        setBlockPickerMenu({
          displayedFrom: `edge-${edge.id}`,
          // Toggles on click if the source is the same, otherwise update
          isDisplayed: displayedFrom === `edge-${edge.id}` ? !blockPickerMenu.isDisplayed : true,
          onBlockClick,
        });
      }}
    />
  );
};

export default BaseEdge;
