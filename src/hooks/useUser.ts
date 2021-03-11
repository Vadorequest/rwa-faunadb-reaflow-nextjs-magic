import Router from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';
import { ApiGetUserResult } from '../../pages/api/user';
import { UserSession } from '../../types/auth/UserSession';

type Props = {
  redirectTo?: string;
  redirectIfFound?: boolean;
}

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
        user: data?.user || null
      };
    });

/**
 * Fetches the current user from our internal /api/user and returns it.
 *
 * The user might not be authenticated, which in this case will return "null".
 * The query might not be done, which in this case will return "undefined".
 *
 * @param props
 *
 * @see https://swr.vercel.app/
 */
export const useUser = (props?: Props): UserSession | null | undefined => {
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

  // "user" might be "undefined" or an instance of "UserSession"
  return error ? null : user;
};
