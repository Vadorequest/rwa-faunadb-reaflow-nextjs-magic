import { FunctionResource } from 'fauna-gql-upload';
import {
  CurrentIdentity,
  Get,
  Lambda,
  Let,
  Query,
  Select,
  Var,
} from 'faunadb';

/**
 * Returns the currently authenticated user.
 *
 * XXX Not actually used in the app, kept as example/experimentation.
 *
 * @see https://github.com/Plazide/fauna-gql-upload#uploading-functions
 */
const getCurrentUser: FunctionResource = {
  name: 'getCurrentUser',
  body: Query(
    Lambda([],
      Let(
        { userRef: CurrentIdentity() },
        Select([], Get(Var('userRef'))),
      ),
    ),
  ),
};

export default getCurrentUser;
