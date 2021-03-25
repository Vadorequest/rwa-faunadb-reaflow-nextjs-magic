import { gql } from 'graphql-request';
import project from '../fragments/project';

/**
 * Used by /src/pages/index.
 *
 * Fetches the projects belonging to the user.
 */
const INDEX_PAGE_QUERY = gql`
  query INDEX_PAGE_QUERY($userId: ID!){
    projects: findProjectsByUserId(id: $userId){
      ...projectFields
    }
  }
  ${project.projectFields}
`;

export default INDEX_PAGE_QUERY;
