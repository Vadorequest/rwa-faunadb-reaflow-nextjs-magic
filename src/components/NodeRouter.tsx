import React from 'react';
import {
  Node,
  NodeData,
  NodeProps,
} from 'reaflow';

type Props = {
  node: NodeProps;
  setEnteredNode: (node: NodeData | undefined) => void;
}

const NodeRouter: React.FunctionComponent<Props> = (props) => {
  const {
    node,
    setEnteredNode,
  } = props;

  return (
    <Node
      {...node}
      className={'node'}
      onClick={() => console.log(`node clicked (${node?.properties?.text || node?.id})`, node)}
      onEnter={(event, node) => setEnteredNode(node)}
      onLeave={(event, node) => setEnteredNode(undefined)}
    />
  );
};

export default NodeRouter;
