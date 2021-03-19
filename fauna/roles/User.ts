import { RoleResource } from 'fauna-gql-upload';
import { Collection } from 'faunadb';
import onlyDeleteByOwner from '../predicates/onlyDeleteByOwner';

/**
 * User role.
 *
 * XXX Not actually used in the app, kept as example/experimentation.
 *
 * @see https://github.com/Plazide/fauna-gql-upload#uploading-functions
 */
const userRole: RoleResource = {
  name: 'user',
  privileges: [
    {
      resource: Collection('Comment'),
      actions: {
        read: true,
        create: true,
        delete: onlyDeleteByOwner,
      },
    },
  ],
}

export default userRole;
