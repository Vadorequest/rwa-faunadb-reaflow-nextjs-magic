import { IndexResource } from 'fauna-gql-upload';
import { Collection } from 'faunadb';

/**
 * Index to filter projects by owner email.
 *
 * Necessary to retrieve the projects belonging to the currently authenticated user.
 * Used in GraphQL query `findProjectsByUserEmail`.
 */
const projects_by_owner_email: IndexResource = {
  name: 'projects_by_owner_email',
  source: Collection('Projects'),
  // Needs permission to read the Users, because "owner" is specified in the "terms" and is a Ref to the "Users" collection
  permissions: {
    read: Collection('Users'),
  },
  // Allow to filter by owner email ("Users")
  terms: [
    { field: ['data', 'owner', 'email'] },
  ],
  // Index contains the Project ref (that's the default behavior and could be omitted)
  values: [
    { field: ['ref'] },
  ],
};

export default projects_by_owner_email;
