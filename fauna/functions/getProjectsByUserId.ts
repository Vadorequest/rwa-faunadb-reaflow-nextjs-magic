import { FunctionResource } from 'fauna-gql-upload';
import {
  Index,
  Lambda,
  Match,
  Paginate,
  Query,
  Ref,
  Var,
} from 'faunadb';

/**
 * Returns the projects owned by the user, using the user's id.
 */
const getProjectsByUserId: FunctionResource = {
  name: 'getProjectsByUserId',
  body: Query(
    Lambda(['id'],
      Paginate(
        Match(
          Index('projectsByOwner'),
          Ref(Var('id')),
        ),
      ),
    ),
  ),
};

export default getProjectsByUserId;
