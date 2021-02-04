import { css } from '@emotion/react';
import React from 'react';
import {
  Canvas,
  Edge,
  EdgeProps,
  hasLink,
  NodeProps,
} from 'reaflow';
import { EdgeData } from 'reaflow/dist/types';
import BaseNodeData from '../types/BaseNodeData';
import NodeRouter from './NodeRouter';

type Props = {
  blocksContainerWidth: string;
  nodes: BaseNodeData[];
  setNodes: (nodes: BaseNodeData[]) => void;
  edges: EdgeData[];
  setEdges: (edges: EdgeData[]) => void;
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
    blocksContainerWidth,
    nodes,
    edges,
    setNodes,
    setEdges,
    isDroppable,
    setDroppable,
    enteredNode,
    setEnteredNode,
  } = props;

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
          background-size: 50px 50px;
          background-image: linear-gradient(90deg, #eeeefe 1px, transparent 0), linear-gradient(180deg, #eeeefe 1px, transparent 0);
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
        className={'reaflow-canvas'}
        direction={'RIGHT'}
        nodes={nodes}
        edges={edges}
        node={(node: NodeProps) => (
          <NodeRouter
            node={node}
            enteredNode={enteredNode}
            setEnteredNode={setEnteredNode}
          />
        )}
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
          return !hasLink(edges, from, to);
        }}
        onNodeLink={(from, to) => {
          const id = `${from.id}-${to.id}`;

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
