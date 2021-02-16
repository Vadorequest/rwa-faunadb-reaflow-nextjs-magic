/**
 * Node type.
 *
 * Defines all the allow node types.
 * The type will affect how the node is rendered (layout, size, etc.)
 *
 * Each node type must have an associated Block component and Node component.
 *  - The Block component is used to select the block to be used (from BlockPickerMenu).
 *  - The Node component is used to render the node.
 *
 * @example The `information` type has the associated InformationBlock and InformationNode components.
 */
export type NodeType =
  'start'
  | 'information'
  | 'question'

export default NodeType;
