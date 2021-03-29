import { UserSession } from '../types/auth/UserSession';

/**
 * Mutates the local user cache.
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

