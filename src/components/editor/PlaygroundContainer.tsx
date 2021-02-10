import { css } from '@emotion/react';
import cloneDeep from 'lodash.clonedeep';
import React, {
  MutableRefObject,
  useEffect,
} from 'react';
import { CanvasRef } from 'reaflow';
import { useRecoilState } from 'recoil';
import { blockPickerMenuState } from '../../states/blockPickerMenuState';
import { edgesState } from '../../states/edgesState';
import { nodesState } from '../../states/nodesState';
import BaseEdgeData from '../../types/BaseEdgeData';
import BaseNodeData from '../../types/BaseNodeData';
import NodeType from '../../types/NodeType';
import {
  addNodeAndEdgeThroughPorts,
  createNodeFromDefaultProps,
  getDefaultNodePropsWithFallback,
} from '../../utils/nodes';
import BlockPickerMenu from '../blocks/BlockPickerMenu';
import CanvasContainer from './CanvasContainer';

type Props = {
  canvasRef: MutableRefObject<CanvasRef | null>;
  initialNodes: BaseNodeData[];
  initialEdges: BaseEdgeData[];
}

/**
 * @see https://github.com/reaviz/reaflow
 */
const PlaygroundContainer: React.FunctionComponent<Props> = (props): JSX.Element | null => {
  const {
    canvasRef,
    initialNodes,
    initialEdges,
  } = props;
  const [blockPickerMenu, setBlockPickerMenu] = useRecoilState(blockPickerMenuState);
  const [nodes, setNodes] = useRecoilState(nodesState);
  const [edges, setEdges] = useRecoilState(edgesState);

  /**
   * Initializes the nodes and edges.
   *
   * Only executed once, after component first rendering.
   */
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, []);

  console.log('nodes.length', nodes.length);
  console.log('nodes', nodes);

  /**
   * Displays the blockPickerMenu when there are less than 2 nodes present.
   * Handle edge cases when there are 0 or 1 node (picker menu must always be displayed then, otherwise the editors can't create new nodes and they're stuck).
   */
  if (!blockPickerMenu.isDisplayed && nodes.length < 2) {
    setBlockPickerMenu({
      displayedFrom: nodes.length === 0 ? 'playground' : `node-${nodes[0].id}`,
      isDisplayed: true,
      onBlockClick: (nodeType: NodeType) => {
        if (nodes.length === 1) {
          // Create a new node and link it to the existing node
          console.log('onBlockClick (1 node)', nodeType);
          const newNode = createNodeFromDefaultProps(getDefaultNodePropsWithFallback(nodeType));
          const results = addNodeAndEdgeThroughPorts(cloneDeep(nodes), cloneDeep(edges), newNode, nodes[0]);
          console.log('results', results);

          setNodes(results.nodes);
          setEdges(results.edges);

        } else if (nodes.length === 0) {
          // Simply create the node using its default properties, and reset all edges
          console.log('onBlockClick (0 nodes)', nodeType);
          const newNode = createNodeFromDefaultProps(getDefaultNodePropsWithFallback(nodeType));

          setNodes([newNode]);
          setEdges([]);
        }
      },
    });
  }

  console.log('Playground render', nodes, edges);

  return (
    <div
      className={'playground-container'}
      css={css`
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        .background {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: #f5f5f5;
          background-size: 50px 50px;
          background-image: linear-gradient(90deg, #eaeaea 1px, transparent 0), linear-gradient(180deg, #eaeaea 1px, transparent 0);
          background-position: right -109px bottom -39px;
          transform: scale(1);
          z-index: -10000;
        }
      `}
    >
      <div className={'background'} />
      <CanvasContainer
        canvasRef={canvasRef}
      />

      <BlockPickerMenu />
    </div>
  );
};

export default PlaygroundContainer;
