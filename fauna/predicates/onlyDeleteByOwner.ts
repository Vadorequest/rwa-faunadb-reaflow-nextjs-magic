import { query as q } from 'faunadb';

/**
 * Returns the currently authenticated user.
 *
 * XXX Not actually used in the app, kept as example/experimentation.
 *
 * @see https://github.com/Plazide/fauna-gql-upload#uploading-functions
 */
const onlyDeleteByOwner = q.Query(
  q.Lambda(
    'ref',
    q.Equals(
      q.CurrentIdentity(),
      q.Select(['data', 'user'], q.Get(q.Var('ref'))),
    ),
  ),
);

export default onlyDeleteByOwner;
