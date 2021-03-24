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
const getProjectsByUser: FunctionResource = {
  name: 'getProjectsByUser',
  body: Query(
    Lambda(['ref'],
      Paginate(
        Match(
          Index('projectsByOwner'),
          Var('ref'),
        ),
      ),
    ),
  ),
};

export default getProjectsByUser;
