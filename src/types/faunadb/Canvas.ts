import { Expr } from 'faunadb';
import BaseEdgeData from '../BaseEdgeData';
import BaseNodeData from '../BaseNodeData';
import { FaunadbRecordBaseFields } from './FaunadbRecordBaseFields';

export type CanvasData = {
  /**
   * Owner (user) of the canvas dataset.
   */
  owner: Expr;

  /**
   * Ephemeral session id of the editor who's updated the canvas dataset at last.
   *
   * The ephemeral session id is unique per page, so it won't be the same if the user has two tabs open.
   */
  lastUpdatedBySessionEphemeralId: string;

  /**
   * Name of the editor who's updated the canvas dataset at last.
   */
  lastUpdatedByUserName: string;

  /**
   * Nodes of the canvas dataset.
   */
  nodes: BaseNodeData[];

  /**
   * Edges of the canvas dataset.
   */
  edges: BaseEdgeData[];
};

export type Canvas = FaunadbRecordBaseFields<CanvasData>;
export type UpdateCanvas = FaunadbRecordBaseFields<Omit<CanvasData, 'owner'>>;
