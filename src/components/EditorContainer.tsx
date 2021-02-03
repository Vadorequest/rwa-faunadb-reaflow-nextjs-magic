import { css } from '@emotion/react';
import { isBrowser } from '@unly/utils';
import React, { useState } from 'react';
import {
  Canvas,
  Edge,
  EdgeProps,
  hasLink,
  Node,
  NodeData,
  NodeProps,
} from 'reaflow';
import { EdgeData } from 'reaflow/dist/types';

type Props = {}

/**
 * @see https://github.com/reaviz/reaflow
 */
const EditorContainer: React.FunctionComponent<Props> = (): JSX.Element | null => {
  if (!isBrowser()) {
    return null;
  }
  const blocksContainerWidth = '30vw';

  const [nodes, setNodes] = useState<NodeData[]>([
    {
      id: '2',
      text: 'Mother',
      data: {
        gender: 'female',
      },
    },
    {
      id: '3',
      text: 'Daughter',
      data: {
        gender: 'female',
      },
    },
    {
      id: '4',
      text: 'Son',
      data: {
        gender: 'male',
      },
    },
  ]);
  const [edges, setEdges] = useState<EdgeData[]>([
    {
      id: '2-3',
      from: '2',
      to: '3',
    },
    {
      id: '2-4',
      from: '2',
      to: '4',
    },
  ]);

  return (
    <div
      className={'editor-container'}
      css={css`
        display: flex;
        position: relative;
        width: 100vw;
        height: calc(100vh - 120px);

        .blocks-container {
          width: ${blocksContainerWidth};
          background-color: lightgrey;
        }

        .playground-container {
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
        }
      `}
    >
      <div
        className={'blocks-container'}
      >
        Block 1
      </div>

      <div
        className={'playground-container'}
      >
        <div className={'background'} />
        <Canvas
          className={'reaflow-canvas'}
          nodes={nodes}
          edges={edges}
          node={(node: NodeProps) => (
            <Node
              {...node}
              className={'node'}
              onClick={() => console.log(node.properties.data)}
            />
          )}
          edge={(edge: EdgeProps) => (
            <Edge
              {...edge}
              className={'edge'}
            />
          )}
          onLayoutChange={layout => console.log('Layout', layout)}
          onNodeLinkCheck={(from: NodeData, to: NodeData) => {
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
    </div>
  );
};

export default EditorContainer;
