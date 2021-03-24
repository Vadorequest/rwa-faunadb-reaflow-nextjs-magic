import { FunctionResource } from 'fauna-gql-upload';
import {
  Index,
  Lambda,
  Match,
  Paginate,
  Query,
  Var,
} from 'faunadb';

/**
 * Returns the projects owned by the user, using the user's email.
 */
const getProjectsByUserEmail: FunctionResource = {
  name: 'findProjectsByUserEmail',
  body: Query(
    Lambda(['email'],
      Paginate(
        Match(
          Index('projects_by_owner_email'),
          Var('email'),
        ),
      ),
    ),
  ),
};

export default getProjectsByUserEmail;
