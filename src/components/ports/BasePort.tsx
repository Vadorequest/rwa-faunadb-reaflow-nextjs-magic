import cloneDeep from 'lodash.clonedeep';
import React from 'react';
import {
  addNodeAndEdge,
  Port,
  PortData,
} from 'reaflow';
import { PortProps } from 'reaflow/dist/symbols/Port/Port';
import { useRecoilState } from 'recoil';
import settings from '../../settings';
import { blockPickerMenuState } from '../../states/blockPickerMenuState';
import { edgesState } from '../../states/edgesState';
import { nodesState } from '../../states/nodesState';
import BaseNodeData from '../../types/BaseNodeData';
import BaseNodeType from '../../types/BaseNodeType';
import BlockPickerMenuState, { OnBlockClick } from '../../types/BlockPickerMenu';
import { createNodeFromDefaultProps } from '../../utils/nodes';
import InformationNode from '../nodes/InformationNode';
import QuestionNode from '../nodes/QuestionNode';

type Props = {
  fromNodeId: string;
} & Partial<PortProps>;

const BasePort: React.FunctionComponent<Props> = (props) => {
  const {
    fromNodeId,
    ...rest
  } = props;

  const [blockPickerMenu, setBlockPickerMenu] = useRecoilState<BlockPickerMenuState>(blockPickerMenuState);
  const [nodes, setNodes] = useRecoilState(nodesState);
  const [edges, setEdges] = useRecoilState(edgesState);
  const node: BaseNodeData = nodes.find((node) => node.id === fromNodeId) as BaseNodeData;

  const style = {
    fill: 'white',
    stroke: 'white',
  };

  const onPortClick = (event: React.MouseEvent<SVGGElement, MouseEvent>, port: PortData) => {
    const onBlockClick: OnBlockClick = (nodeType: BaseNodeType) => {
      console.log('onBlockClick', nodeType);
      const NodeComponent = nodeType === 'question' ? QuestionNode : InformationNode;
      const newNode = createNodeFromDefaultProps(NodeComponent.getDefaultNodeProps());
      const fromNode: BaseNodeData = port.side === 'EAST' ? newNode : node;
      const toNode: BaseNodeData = port.side === 'EAST' ? node : newNode;
      // TODO Doesn't work when selecting the left port - See https://github.com/reaviz/reaflow/issues/48
      const results = addNodeAndEdge(cloneDeep(nodes), cloneDeep(edges), fromNode, toNode);
      console.log('addNodeAndEdge fromNode', fromNode, 'toNode', toNode, 'results', results);

      setNodes(results.nodes);
      setEdges(results.edges);
    };

    setBlockPickerMenu({
      isDisplayed: true, // Toggle on click XXX change later, should toggle but not easy to test when toggle is on
      onBlockClick,
    });
  };

  const onPortEnter = (event: React.MouseEvent<SVGGElement, MouseEvent>, port: PortData) => {
    console.log('onEnter port: ', node);
  };

  const onPortLeave = (event: React.MouseEvent<SVGGElement, MouseEvent>, port: PortData) => {
    console.log('onLeave port: ', node);
  };

  return (
    <Port
      {...rest}
      onClick={onPortClick}
      onEnter={onPortEnter}
      onLeave={onPortLeave}
      style={style}
      rx={settings.canvas.ports.radius}
      ry={settings.canvas.ports.radius}
    />
  );
};

export default BasePort;
