import { css } from '@emotion/react';
import React, { MutableRefObject } from 'react';
import {
  Canvas,
  CanvasRef,
  Edge,
  EdgeProps,
  hasLink,
  NodeProps,
} from 'reaflow';
import { EdgeData } from 'reaflow/dist/types';
import { useRecoilState } from 'recoil';
import { edgesState } from '../../states/edges';
import { nodesState } from '../../states/nodes';
import BaseNodeData from '../../types/BaseNodeData';
import NodeRouter from '../nodes/NodeRouter';
import cloneDeep from 'lodash.clonedeep';

type Props = {
  canvasRef: MutableRefObject<CanvasRef | null>;
  blocksContainerWidth: string;
  isDraggedNodeClose: boolean;
  isDroppable: boolean;
  setDroppable: (isDroppable: boolean) => void;
  enteredNode: BaseNodeData | undefined;
  setEnteredNode: (node: BaseNodeData | undefined) => void;
}

/**
 * @see https://github.com/reaviz/reaflow
 */
const PlaygroundContainer: React.FunctionComponent<Props> = (props): JSX.Element | null => {
  const {
    canvasRef,
    blocksContainerWidth,
    isDraggedNodeClose,
    isDroppable,
    setDroppable,
    enteredNode,
    setEnteredNode,
  } = props;
  const [nodes, setNodes] = useRecoilState<BaseNodeData[]>(nodesState);
  const [edges, setEdges] = useRecoilState<EdgeData[]>(edgesState);

  console.log('playground nodes', nodes);

  return (
    <div
      className={'playground-container'}
      css={css`
        position: absolute;
        top: 0;
        bottom: 0;
        left: ${blocksContainerWidth};
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

        .reaflow-canvas {
          .edge {
            stroke: #b1b1b7;
            stroke-dasharray: 5;
            animation: dashdraw .5s linear infinite;
            stroke-width: 1;
          }

          @keyframes dashdraw {
            0% {
              stroke-dashoffset: 10;
            }
          }
        }
      `}
    >
      <div className={'background'} />
      <Canvas
        ref={canvasRef}
        className={'reaflow-canvas'}
        direction={'RIGHT'}
        nodes={nodes}
        edges={edges}
        node={(node: NodeProps) => {
          const id = node.id;

          const updateCurrentNode = (nodeData: Partial<BaseNodeData>): void => {
            console.log('Updating current node with', nodeData);
            const nodeToUpdateIndex = nodes.findIndex((node: BaseNodeData) => node.id === id);
            console.log('updateCurrentNode nodeToUpdateIndex', nodeToUpdateIndex);
            const nodeToUpdate = {
              ...nodes[nodeToUpdateIndex],
              ...nodeData,
              id, // Force keep same id to avoid edge cases
            };
            console.log('updateCurrentNode updated node', nodeToUpdate);

            const newNodes = cloneDeep(nodes);
            newNodes[nodeToUpdateIndex] = nodeToUpdate;
            console.log('updateCurrentNode new nodes', newNodes);

            setNodes(newNodes);
          };

          console.log('node in canvas', node, nodes);
          return (
            <NodeRouter
              node={node}
              updateCurrentNode={updateCurrentNode}
              isDroppable={isDroppable}
              isDraggedNodeClose={isDraggedNodeClose}
              enteredNode={enteredNode}
              setEnteredNode={setEnteredNode}
            />
          );
        }}
        edge={(edge: EdgeProps) => (
          <Edge
            {...edge}
            className={'edge'}
          />
        )}
        onLayoutChange={layout => console.log('Layout', layout)}
        onMouseEnter={() => {
          if (!isDroppable) {
            console.log('setDroppable', true);
            setDroppable(true);
          }
        }}
        onMouseLeave={() => {
          // console.log('setDroppable', false);
          // setDroppable(false);
        }}
        onNodeLinkCheck={(from: BaseNodeData, to: BaseNodeData) => {
          console.log('onNodeLinkCheck', 'will link?', !hasLink(edges, from, to));
          return !hasLink(edges, from, to);
        }}
        onNodeLink={(from, to) => {
          const id = `${from.id}-${to.id}`;
          console.log('onNodeLink', id);

          setEdges([
            ...edges,
            {
              id,
              from: from.id,
              to: to.id,
            },
          ]);
        }}
      />
    </div>
  );
};

export default PlaygroundContainer;
