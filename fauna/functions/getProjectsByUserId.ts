import { FunctionResource } from 'fauna-gql-upload';
import {
  Collection,
  Get,
  Index,
  Lambda,
  Map,
  Match,
  Paginate,
  Query,
  Ref,
  Select,
  Var,
} from 'faunadb';

/**
 * Returns the projects owned by the user, using the user's id.
 */
const getProjectsByUserId: FunctionResource = {
  name: 'getProjectsByUserId',
  body: Query(
    Lambda(['id'],
      // Select the "data" value, otherwise it'd return an object where the projects are inside "data" and that'd make the GQL query fail
      Select(
        ['data'],
        // For each result (project's Ref)
        Map(
          // Paginate results in case there would be too many to fetch them at once
          Paginate(
            // Finds the projects that belongs to the user (by user id)
            Match(
              Index('projectsByOwner'),
              Ref(Collection('Users'), Var('id')),
            ),
          ),
          // Convert the project's ref into the actual object
          Lambda(['ref'], Get(Var('ref'))),
        ),
      ),
    ),
  ),
};

export default getProjectsByUserId;
