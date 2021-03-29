import { UserSession } from '../types/auth/UserSession';
import { Project } from '../types/graphql/graphql';
import { mutateProject } from './project';

/**
 * Mutates the user in the SWR cache.
 *
 * @param userSession
 * @param user
 */
export const mutateLocalUser = (userSession: UserSession, user: Partial<UserSession>): void => {
  userSession?.mutate?.({
    // @ts-ignore Our types aren't good, "User" and "UserSession" are a bit too mixed
    user,
  }, false);
};

/**
 * Mutates the user project's label in the SWR cache.
 *
 * @param userSession
 * @param label
 */
export const mutateLocalUserActiveProjectLabel = (userSession: UserSession, label: string): void => {
  mutateLocalUser(userSession, {
    ...userSession as UserSession,
    projects: mutateProject(userSession?.projects as Project[], {
      id: userSession?.activeProject?.id,
      label,
    } as Project),
  });
};
