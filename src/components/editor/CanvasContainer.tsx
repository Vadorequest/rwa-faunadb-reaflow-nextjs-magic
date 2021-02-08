import { css } from '@emotion/react';
import React, {
  MutableRefObject,
  useEffect,
} from 'react';
import {
  Canvas,
  CanvasRef,
  EdgeProps,
  hasLink,
  NodeProps,
  useSelection,
} from 'reaflow';
import { useRecoilState } from 'recoil';
import settings from '../../settings';
import { edgesState } from '../../states/edgesState';
import { nodesState } from '../../states/nodesState';
import BaseEdgeData from '../../types/BaseEdgeData';
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

  useEffect(() => {
    console.log('canvasRef', canvasRef);
  }, [canvasRef]);

  const [nodes, setNodes] = useRecoilState(nodesState);
  const [edges, setEdges] = useRecoilState(edgesState);
  const {
    selections,
    onCanvasClick,
    onClick: onSelectionClick,
    onKeyDown: onSelectionKeyDown,
  } = useSelection({
    nodes,
    edges,
    onDataChange: (nodes: BaseNodeData[], edges: BaseEdgeData[]) => {
      console.info('Data changed', nodes, edges);
      setNodes(nodes);
      setEdges(edges);
    },
    onSelection: (selectionIds: string[]) => {
      console.info('onSelection Selected items', selectionIds);
    },
  });

  return (
    <div
      className={'canvas-container'}
      css={css`
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
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
        direction={settings.canvas.direction}
        nodes={nodes}
        edges={edges}
        selections={selections}
        node={(nodeProps: NodeProps) => {
          return (
            <NodeRouter
              nodeProps={nodeProps}
              onSelectionClick={onSelectionClick as (event: React.MouseEvent<SVGGElement, MouseEvent>, data: any) => void}
              onSelectionKeyDown={onSelectionKeyDown as (event: React.KeyboardEvent<SVGGElement>) => void}
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
        onCanvasClick={onCanvasClick}
        onLayoutChange={layout => console.log('Layout', layout)}
        onNodeLinkCheck={(from: BaseNodeData, to: BaseNodeData) => {
          console.log('onNodeLinkCheck', 'will link?', !hasLink(edges, from, to), from, to);
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
