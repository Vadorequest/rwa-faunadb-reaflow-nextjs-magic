import {
  Collection,
  Documents,
  ExprArg,
  Function,
  Get,
  Lambda,
  Map,
  Paginate,
  Var,
} from 'faunadb';
import { q } from '../lib/faunadb/faunadb';

const { Exists, If, Delete, Update, CreateFunction, CreateRole, Role } = q;

// Inspiration from https://github.com/fauna-brecht/faunadb-auth-skeleton-frontend/blob/default/fauna-queries/helpers/fql.js

export const DeleteIfExists = (ref: ExprArg) => If(Exists(ref), Delete(ref), false);

export const IfNotExists = (ref: ExprArg, then: ExprArg) => If(Exists(ref), false, then);

export const CreateOrUpdateFunction = (obj: any) => If(
  Exists(Function(obj.name)),
  Update(Function(obj.name), { body: obj.body, role: obj.role }),
  CreateFunction({ name: obj.name, body: obj.body, role: obj.role }),
);

export const CreateOrUpdateRole = (obj: any) => If(
  Exists(Role(obj.name)),
  Update(Role(obj.name), { membership: obj.membership, privileges: obj.privileges }),
  CreateRole(obj),
);

/**
 *
 * @param collectionName
 *
 * @see https://fauna.com/blog/modernizing-from-postgresql-to-serverless-with-fauna-part-1#select
 */
export const SelectAll = (collectionName: string) => Map(
  Paginate(Documents(Collection(collectionName))),
  Lambda(
    ['ref'],
    Get(Var('ref')),
  ),
);
