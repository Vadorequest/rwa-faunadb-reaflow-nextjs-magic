import { Expr } from 'faunadb';
import BaseEdgeData from '../BaseEdgeData';
import BaseNodeData from '../BaseNodeData';
import { FaunadbRecordBaseFields } from './FaunadbRecordBaseFields';

export type Canvas = FaunadbRecordBaseFields<{
  /**
   * Owner (user) of the canvas dataset.
   */
  owner: Expr;

  /**
   * Last editor (user) who's updated the canvas dataset.
   */
  lastEditorId: string;

  /**
   * Nodes of the canvas dataset.
   */
  nodes: BaseNodeData[];

  /**
   * Edges of the canvas dataset.
   */
  edges: BaseEdgeData[];
}>
