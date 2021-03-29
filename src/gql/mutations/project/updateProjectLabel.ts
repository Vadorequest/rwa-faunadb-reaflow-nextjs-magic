import { gql } from 'graphql-request';
import { Project } from '../../../types/graphql/graphql';
import project from '../../fragments/project';

export type UpdateProjectLabelMutationResult = {
  updatedProject: Project;
};

/**
 * Updates the project's label.
 *
 * Uses "updateProject" mutation, which is automatically created by FaunaDB.
 */
const UPDATE_PROJECT_LABEL = gql`
  mutation UPDATE_PROJECT_LABEL($projectId: ID!, $label: String!){
    updatedProject: updateProject(id: $projectId, data: {
      id: $projectId
      label: $label
    }){
      ...projectFields
    }
  }
  ${project.projectFields}
`;

export default UPDATE_PROJECT_LABEL;
