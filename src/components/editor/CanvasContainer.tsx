import { css } from '@emotion/react';
import cloneDeep from 'lodash.clonedeep';
import React, { MutableRefObject } from 'react';
import {
  Canvas,
  CanvasRef,
  EdgeProps,
  hasLink,
  NodeProps,
} from 'reaflow';
import { useRecoilState } from 'recoil';
import { edgesState } from '../../states/edgesState';
import { isDraggedNodeDroppableState } from '../../states/isDraggedNodeDroppableState';
import { nodesState } from '../../states/nodesState';
import BaseNodeData from '../../types/BaseNodeData';
import BaseEdge from '../edges/BaseEdge';
import NodeRouter from '../nodes/NodeRouter';

type Props = {
  canvasRef: MutableRefObject<CanvasRef | null>;
}

/**
 * @see https://github.com/reaviz/reaflow
 */
const CanvasContainer: React.FunctionComponent<Props> = (props): JSX.Element | null => {
  const {
    canvasRef,
  } = props;
  const [nodes, setNodes] = useRecoilState(nodesState);
  const [edges, setEdges] = useRecoilState(edgesState);
  const [isDroppable, setDroppable] = useRecoilState(isDraggedNodeDroppableState);

  return (
    <div
      className={'canvas-container'}
      css={css`
        position: absolute;
        top: 0;
        bottom: 0;
        left: 150px;
        right: 0;

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
      <Canvas
        ref={canvasRef}
        className={'reaflow-canvas'}
        direction={'RIGHT'}
        nodes={nodes}
        edges={edges}
        node={(nodeProps: NodeProps) => {
          const id = nodeProps.id;

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

          // console.log('node in canvas', nodeProps, nodes);
          return (
            <NodeRouter
              nodeProps={nodeProps}
              updateCurrentNode={updateCurrentNode}
            />
          );
        }}
        edge={(edgeProps: EdgeProps) => {
          return (
            <BaseEdge
              {...edgeProps}
            />
          );
        }}
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

export default CanvasContainer;
