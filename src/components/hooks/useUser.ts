import Router from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';
import { UserSession } from '../../types/auth/UserSession';

type Props = {
  redirectTo?: string;
  redirectIfFound?: boolean;
}

const fetcher = (url: string) =>
  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      return { user: data?.user || null };
    });

export const useUser = (props: Props = {}): UserSession | null => {
  const { redirectTo, redirectIfFound } = props;
  const { data, error } = useSWR(
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

  return error ? null : user;
};
