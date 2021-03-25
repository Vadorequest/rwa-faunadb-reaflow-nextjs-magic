import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { HttpOptions } from '@apollo/client/link/http/selectHttpOptionsAndBody';
import merge from 'deepmerge';
import isEqual from 'lodash.isequal';
import { useMemo } from 'react';
import { UserSession } from '../../types/auth/UserSession';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

export type ApolloState = {
  [APOLLO_STATE_PROP_NAME]: NormalizedCacheObject;
};

let apolloClient: ApolloClient<NormalizedCacheObject>;

/**
 * Create a new apollo client instance.
 *
 * @returns {ApolloClient<NormalizedCacheObject>}
 */
function createApolloClient(userSession: Partial<UserSession>): ApolloClient<NormalizedCacheObject> {
  if (!process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT) {
    throw new Error(`The NEXT_PUBLIC_GRAPHQL_API_ENDPOINT environment variable is not defined. It must be defined to fetch the GraphQL endpoint. (using value: "${process.env.GRAPHQL_API_ENDPOINT}")`);
  }

  // The token in the user session will be null when the user isn"t authenticated, but that's the expected behavior
  // Although, if the user is authenticated but doesn't have a faunaDB token, then querying the GQL endpoint won't work (that shouldn't happen)
  if (userSession?.isAuthenticated && !userSession?.faunaDBToken) {
    console.warn(`The current user doesn't have a valid FaunaDB token. Querying GraphQL will not work unless an authentication token is provided. (using value: "${userSession?.faunaDBToken}")`);
  }

  const httpLinkOptions: HttpOptions = {
    uri: process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT, // Server URL (must be absolute)
    credentials: 'same-origin', // XXX See https://www.apollographql.com/docs/react/recipes/authentication#cookie
  };

  if (userSession?.faunaDBToken) {
    // Headers applied here will be applied for all requests
    // See the use of the "options" when running a graphQL query to specify options per-request at https://www.apollographql.com/docs/react/api/react-hooks/#options
    httpLinkOptions.headers = {
      authorization: userSession?.faunaDBToken ? `Bearer ${userSession?.faunaDBToken}` : null,
    };
  }

  const httpLink: ApolloLink = new HttpLink(httpLinkOptions);

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: httpLink,
    cache: new InMemoryCache(),
  });
}

/**
 * Initiate apollo based on the environment (client or server).
 *
 * @param userSession
 * @param initialState
 * @returns {ApolloClient<NormalizedCacheObject>}
 */
export function initializeApollo(userSession: Partial<UserSession>, initialState = null): ApolloClient<NormalizedCacheObject> {
  const client = apolloClient ?? createApolloClient(userSession);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = client.extract();

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState as unknown as object, existingCache, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s)),
        ),
      ],
    });

    // Restore the cache with the merged data
    client.cache.restore(data);
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') {
    return client;
  }

  // Create the Apollo Client once in the client
  if (!apolloClient) {
    apolloClient = client;
  }

  return client;
}

/**
 * Returns the apollo state.
 *
 * @param {ApolloClient<NormalizedCacheObject>} client
 * @returns {NormalizedCacheObject}
 */
export function getApolloState(client: ApolloClient<NormalizedCacheObject>): NormalizedCacheObject {
  return client.cache.extract();
}

/**
 * Returns an instance of apollo client.
 *
 * @param pageProps
 * @param userSession
 * @returns {ApolloClient<NormalizedCacheObject>}
 */
export function useApollo<T>(pageProps: T, userSession: Partial<UserSession>): ApolloClient<NormalizedCacheObject> {
  console.log('useApollo', userSession?.faunaDBToken);
  const state = (pageProps as any)?.[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo(userSession, state), [state, userSession]);
  console.log('useApollo store', store?.link?.options);
  return store;
}
