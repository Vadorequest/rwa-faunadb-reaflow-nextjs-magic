import { RoleResource } from 'fauna-gql-upload';
import {
  And,
  Collection,
  CurrentIdentity,
  Equals,
  Get,
  Index,
  Lambda,
  Query,
  Select,
  Var,
} from 'faunadb';

/**
 * The "Editor" role is assigned to all authenticated users.
 *
 * It is automatically assigned when a user is authenticated, because it defines "membership" to the Users collection.
 * It is secure because the token is generated upon login on the server-side and stored in a "httpOnly" cookie that can only be read/written on the server-side.
 * The token is specific to the user and is used on the frontend.
 * The token only allows the user to read/write documents that belongs to him.
 */
const editorRole: RoleResource = {
  name: 'Editor',
  // All users should be editors (will apply to authenticated users only).
  membership: [{
    resource: Collection('Users'),
  }],
  privileges: [
    {
      // Editors need read access to the canvasByOwner index to find their own canvas
      resource: Index('canvasByOwner'),
      actions: {
        read: true,
      },
    },
    {
      resource: Collection('Canvas'),
      actions: {
        // Editors should be able to read (+ history) of Canvas documents that belongs to them.
        read: Query(
          Lambda('ref', Equals(
            CurrentIdentity(),
            Select(['data', 'owner'], Get(Var('ref'))),
          )),
        ),
        history_read: Query(
          Lambda('ref', Equals(
            CurrentIdentity(),
            Select(['data', 'owner'], Get(Var('ref'))),
          )),
        ),
        // Editors should be able to edit only Canvas documents that belongs to them
        write: Query(
          Lambda(
            ['oldData', 'newData', 'ref'],
            And(
              // The owner in the current data (before writing them) must be the current user
              Equals(
                CurrentIdentity(),
                Select(['data', 'owner'], Var('oldData')),
              ),
              // The owner must not change
              Equals(
                Select(['data', 'owner'], Var('oldData')),
                Select(['data', 'owner'], Var('newData')),
              ),
            ),
          )
        ),
        // Editors should be able to create only Canvas documents that belongs to them
        create: Query(
          Lambda('values', Equals(
            CurrentIdentity(),
            Select(['data', 'owner'], Var('values'))),
          )
        ),
      },
    },
  ],
};

export default editorRole;
