import { Project } from '../types/graphql/graphql';

/**
 * Mutates a single project in the projects array.
 *
 * @param projects
 * @param projectToUpdate
 */
export const mutateProject = (projects: Project[], projectToUpdate: Project): Project[] => {
  return [
    ...projects?.filter((project: Project) => project?.id !== projectToUpdate?.id) as Project[] || [],
    projectToUpdate,
  ];
};
