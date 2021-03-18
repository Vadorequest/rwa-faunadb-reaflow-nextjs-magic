import Router from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';
import { v1 as uuid } from 'uuid';
import { ApiGetUserResult } from '../pages/api/user';
import { UserSession } from '../types/auth/UserSession';

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
  const {
    data,
    error,
  } = useSWR<ApiGetUserResult>(
    '/api/user',
    fetcher,
    {
      // Automatically refresh the page once the user has logged in, to update the UI
      refreshInterval: 1000,
    },
  );

  const isLoading = !error && !data;
  const user = data?.user;
  const hasUser = Boolean(user);

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
    console.error(error);
  }

  if (error) {
    return {
      sessionEphemeralId,
      isSessionReady: false,
      error: error,
    };
  } else if (user) {
    return {
      ...data?.user || {},
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
