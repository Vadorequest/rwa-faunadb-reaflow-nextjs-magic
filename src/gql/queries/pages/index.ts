import { gql } from 'graphql-request';
import { Project } from '../../../types/graphql/graphql';
import project from '../../fragments/project';

export type IndexPageQueryResult = {
  projects: Project[];
}

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
