import { gql } from 'graphql-request';
import { Project } from '../../../types/graphql/graphql';
import project from '../../fragments/project';

export type CreateProjectMutationResult = {
  createdProject: Project;
};

/**
 * Creates a new project and links it to the user.
 *
 * Uses "createProject" mutation, which is automatically created by FaunaDB.
 */
const CREATE_PROJECT = gql`
  mutation CREATE_PROJECT($userId: ID!, $label: String!){
    createdProject: createProject(data: {
      id: ""
      label: $label
      owner: {
        connect: $userId
      }
    }){
      ...projectFields
    }
  }
  ${project.projectFields}
`;

export default CREATE_PROJECT;
