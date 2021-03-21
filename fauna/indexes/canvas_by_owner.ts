import { IndexResource } from 'fauna-gql-upload';
import { Collection } from 'faunadb';

/**
 * Index to filter canvas by owner.
 *
 * Necessary for real-time subscription, to retrieve the canvas of the current user.
 */
const users_by_email: IndexResource = {
  name: 'canvas_by_owner',
  source: Collection('Canvas'),
  // Needs permission to read the Users, because "owner" is specified in the "terms" and is a Ref to the "Users" collection
  permissions: {
    read: Collection('Users'),
  },
  // Allow to filter by owner ("Users")
  terms: [
    { field: ['data', 'owner'] },
  ],
  // Index contains the Canvas ref (that's the default behavior and could be omitted)
  values: [
    { field: ['ref'] },
  ],
};

export default users_by_email;
