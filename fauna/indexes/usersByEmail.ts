import { IndexResource } from 'fauna-gql-upload';
import { Collection } from 'faunadb';

/**
 * Index to filter users by email
 *
 * Necessary for authentication, to find the user document based on their email.
 */
const usersByEmail: IndexResource = {
  name: 'usersByEmail',
  source: Collection('Users'),
  terms: [
    { field: ['data', 'email'] },
  ],
  unique: true,
};

export default usersByEmail;
