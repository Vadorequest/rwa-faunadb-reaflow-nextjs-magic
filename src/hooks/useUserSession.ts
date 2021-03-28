import Router from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';
import { v1 as uuid } from 'uuid';
import { ApiGetUserResult } from '../pages/api/user';
import { UserSession } from '../types/auth/UserSession';
import { Project } from '../types/graphql/graphql';

type Props = {
  redirectTo?: string;
  redirectIfFound?: boolean;
}

/**
 * Generate an ephemeral session id.
 *
 * This session ephemeral id will be regenerate for each page refresh.
 */
const sessionEphemeralId: string = uuid();

/**
 * The fetcher is an async function that accepts the key of SWR, and returns the data.
 *
 * @param url
 *
 * @see https://swr.vercel.app/docs/data-fetching
 */
const fetcher = (url: string): Promise<ApiGetUserResult> =>
  fetch(url)
    .then((r) => r.json())
    .then((data: ApiGetUserResult) => {
      return {
        user: data?.user || null,
      };
    });

/**
 * Fetches the user session by calling our Next.js internal API endpoint.
 */
const fetchUseSession = () => {
  const {
    data,
    error,
  } = useSWR<ApiGetUserResult>(
    '/api/user',
    fetcher,
  );

  if (error) {
    console.error(error);
  }

  const isLoading = !error && !data;
  const user = data?.user;
  const hasUser = Boolean(user);

  return {
    isLoading,
    user,
    hasUser,
    data,
    error,
  };
};

/**
 * Fetches the current user from our internal /api/user and returns it.
 *
 * Until the query is completed (async), it will return a partial UserSession.
 * Will return a UserSession instance if the user is authenticated.
 *
 * You can use "isSessionReady" to know whether the session is ready or not.
 *
 * @param props
 *
 * @see https://swr.vercel.app/
 */
export const useUserSession = (props?: Props): Partial<UserSession> => {
  const { redirectTo, redirectIfFound } = props || {};
  const { hasUser, isLoading, user, error } = fetchUseSession();

  useEffect(() => {
    if (!redirectTo || isLoading) return;
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !hasUser) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && hasUser)
    ) {
      Router.push(redirectTo);
    }
  }, [redirectTo, redirectIfFound, isLoading, hasUser]);

  if (error) {
    return {
      sessionEphemeralId,
      isSessionReady: false,
      error: error,
    };
  } else if (user) {
    // Load the current active user project form localstorage, fallback to the first project found
    const activeProjectId = localStorage.getItem('activeProjectId');
    user.activeProject = activeProjectId ? user?.projects?.find((project: Project) => project?.id === activeProjectId) : user?.projects?.[0];

    return {
      ...user,
      sessionEphemeralId,
      isSessionReady: !isLoading,
    };
  } else {
    // The user session contains only partial information when the user isn't authenticated (or when the query is still loading)
    return {
      sessionEphemeralId,
      isSessionReady: !isLoading,
    };
  }
};
