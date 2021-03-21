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
 * The "Public" role is assigned to anyone who isn't authenticated.
 *
 * It doesn't use "membership" (unlike "Editor" role) but a token created manually that doesn't expire.
 * It is secure because the token only grant access to the special document of id "1", which is shared amongst all guests.
 * Guests can only read/write this particular document and not any other.
 */
const publicRole: RoleResource = {
  name: 'Public',
  // The public role is meant to be used to generate a key which allows anyone (unauthenticated users) to update the canvas
  privileges: [
    {
      resource: Collection('Canvas'),
      actions: {
        // Guests should only be allowed to read the Canvas of id "1"
        read: Query(
          Lambda('ref',
            Equals(
              '1',
              Select(['id'], Var('ref'),
              ),
            ),
          ),
        ),
        // Guests should only be allowed to update the Canvas of id "1"
        write: Query(
          Lambda(
            ['oldData', 'newData', 'ref'],
            Equals(
              '1',
              Select(['id'], Var('ref')),
            ),
          )
        ),
        // Guests should only be allowed to create the Canvas of id "1"
        // We can't check the ref.id during the "create" operation, because we can only access the values
        // Instead, should lookup for an existing Canvas of id 1 and only allow creation if it doesn't exist yet
        create: true,
        // Creating a record with a custom ID requires history_write privilege
        // See https://fauna-community.slack.com/archives/CAKNYCHCM/p1615413941454700
        history_write: Query(
          Lambda(
            ['ref', 'ts', 'action', 'data'],
            Equals(
              '1',
              Select(['id'], Var('ref')),
            ),
          )
        ),
      },
    },
  ],
};

export default publicRole;
