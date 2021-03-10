import { values } from 'faunadb';
import BaseEdgeData from '../BaseEdgeData';
import BaseNodeData from '../BaseNodeData';

export type CanvasByOwnerIndexData = [
  values.Ref,
  BaseNodeData[],
  BaseEdgeData[],
];

export type CanvasByOwnerIndex = {
  data: CanvasByOwnerIndexData[];
};
