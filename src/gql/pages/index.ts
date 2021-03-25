import { gql } from 'graphql-request';

/**
 * Used by /src/pages/index.
 *
 * Fetches the projects belonging to the user.
 */
const INDEX_PAGE_QUERY = gql`
  query INDEX_PAGE_QUERY($userId: ID!){
    projects: findProjectsByUserId(id: $userId){
      id: _id
      label
      owner {
        _id
        email
      }
    }
  }
`;

export default INDEX_PAGE_QUERY;
