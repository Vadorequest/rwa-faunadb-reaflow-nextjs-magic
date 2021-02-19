import React from 'react';
import { NodeProps } from 'reaflow';
import { useRecoilState } from 'recoil';
import { nodesSelector } from '../../states/nodesState';
import BaseNodeData from '../../types/BaseNodeData';
import { findNodeComponentByType } from '../../utils/nodes';

type Props = {
  nodeProps: NodeProps;
}

/**
 * Node router.
 *
 * Acts as a router between node layouts, by rendering a different node layout, depending on the node "type".
 */
const NodeRouter: React.FunctionComponent<Props> = (props) => {
  const {
    nodeProps,
  } = props;
  const nodeType = nodeProps?.properties?.data?.type;
  const [nodes, setNodes] = useRecoilState(nodesSelector);
  const node: BaseNodeData = nodes.find((node: BaseNodeData) => node.id === nodeProps.id) as BaseNodeData;

  // If the node is not defined then we don't render the node component because it'll crash
  // XXX It can happen sometimes when removing nodes that are being displayed,
  //  the node itself still exist in the Canvas, but doesn't exist anymore in the "nodesState".
  if (typeof node === 'undefined') {
    return null;
  }

  if (!nodeType) {
    try {
      console.error(`Node with nodeType="${nodeType}" couldn't be rendered. Props: ${JSON.stringify(nodeProps, null, 2)}`);
    } catch (e) {
      console.error(`Node with nodeType="${nodeType}" couldn't be rendered. Props cannot be stringified.`);
    }

    return null;
  }

  const NodeComponent = findNodeComponentByType(nodeType);

  return (
    <NodeComponent
      {...nodeProps}
      node={node}
    />
  );
};

export default NodeRouter;
