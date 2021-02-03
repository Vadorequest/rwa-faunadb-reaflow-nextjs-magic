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
const ReaflowContainer: React.FunctionComponent<Props> = (): JSX.Element | null => {
  if (!isBrowser()) {
    return null;
  }

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
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: '30vw', right: 0 }}>
      <Canvas
        nodes={nodes}
        edges={edges}
        node={(node: NodeProps) => (
          <Node
            {...node}
            onClick={() => console.log(node.properties.data)}
            style={{ fill: node.properties.data?.gender === 'male' ? 'blue' : 'red' }}
          />
        )}
        edge={(edge: EdgeProps) => (
          <Edge
            {...edge}
            style={{ stroke: edge.id === '2-4' ? 'blue' : 'red' }}
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
  );
};

export default ReaflowContainer;
