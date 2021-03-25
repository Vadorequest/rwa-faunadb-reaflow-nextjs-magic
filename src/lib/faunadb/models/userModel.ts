import Expr from 'faunadb/src/types/Expr';
import { GraphQLClient } from 'graphql-request';
import INDEX_PAGE_QUERY, { IndexPageQueryResult } from '../../../gql/pages';
import { UserSession } from '../../../types/auth/UserSession';
import { FaunadbToken } from '../../../types/faunadb/FaunadbToken';
import { User } from '../../../types/faunadb/User';
import { Project } from '../../../types/graphql/graphql';
import {
  getClient,
  q,
} from '../faunadb';
import { faunadbAdminClient } from '../faunadbAdminClient';

const {
  Create,
  Collection,
  Get,
  Index,
  Tokens,
  Match,
  Select,
  Logout,
} = q;

/**
 * Helps managing users in the FaunaDB database.
 *
 * @see https://magic.link/posts/todomvc-magic-nextjs-fauna#step-43-modifying-users-in-faunadb-and-issuing-sessions Inspired from
 */
export class UserModel {
  /**
   * Creates a new user in the "users" collection.
   *
   * @param email
   */
  async createUser(email: string): Promise<User | undefined> {
    return faunadbAdminClient?.query<User>(Create(Collection('Users'), {
      data: { email },
    }));
  }

  /**
   * Find a user using the "users_by_email" index.
   *
   * Don't throw on failures because we want to auto-create users when they don't exist yet.
   *
   * @param email
   */
  async getUserByEmail(email: string): Promise<User | undefined> {
    return faunadbAdminClient?.query<User>(
      Get(Match(Index('users_by_email'), email)),
    ).catch(() => undefined);
  }

  /**
   * Generates a FaunaDB Token for the user.
   *
   * The token is associated to the user instance.
   *
   * @param user
   *
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/tokens?lang=javascript
   */
  async obtainFaunaDBToken(user: User): Promise<string | undefined> {
    return faunadbAdminClient?.query<FaunadbToken>(
      Create(Tokens(), { instance: Select('ref', user) }),
    ).then((res: FaunadbToken): string | undefined => res?.secret);
  }

  /**
   *
   * @param token
   */
  async invalidateFaunaDBToken(token: string) {
    await getClient(token)?.query<Expr>(Logout(true));
  }

  /**
   * Fetches all the user's projects.
   *
   * @param userSession
   */
  async getProjects(userSession: UserSession): Promise<Project[]> {
    const gqlClient = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string);

    // User is authenticated, we need to fetch its projects and await until they've been fetched
    gqlClient.setHeaders({
      authorization: `Bearer ${userSession?.faunaDBToken}`,
    });

    const variables = {
      userId: userSession?.id,
    };

    try {
      console.log('Running GQL query', INDEX_PAGE_QUERY, variables, gqlClient);
      const data = await gqlClient.request<IndexPageQueryResult>(INDEX_PAGE_QUERY, variables);

      console.log('data', data);

      return data?.projects || [];

    } catch (e) {
      console.error(JSON.stringify(e, undefined, 2));
      return [];
    }
  }
}
