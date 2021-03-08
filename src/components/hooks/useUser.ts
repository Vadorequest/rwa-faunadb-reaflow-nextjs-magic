import Router from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';

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

export const useUser = (props: Props = {}) => {
  const { redirectTo, redirectIfFound } = props;
  const { data, error } = useSWR('/api/user', fetcher);
  const user = data?.user;
  console.log('user', user, data, error)
  const finished = Boolean(data);
  const hasUser = Boolean(user);

  useEffect(() => {
    if (!redirectTo || !finished) return;
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !hasUser) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && hasUser)
    ) {
      Router.push(redirectTo);
    }
  }, [redirectTo, redirectIfFound, finished, hasUser]);

  return error ? null : user;
};
