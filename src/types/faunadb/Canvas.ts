import { Expr } from 'faunadb';
import { FaunadbRecordBaseFields } from './FaunadbRecordBaseFields';

export type Canvas = FaunadbRecordBaseFields<{
  owner: Expr;
  nodes: object[];
  edges: object[];
}>
