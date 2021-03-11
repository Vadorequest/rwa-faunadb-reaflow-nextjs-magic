import Expr from 'faunadb/src/types/Expr';
import { FaunadbToken } from '../../../types/faunadb/FaunadbToken';
import { User } from '../../../types/faunadb/User';
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
    )
      .then((res: FaunadbToken): string | undefined => res?.secret)
      .catch(() => undefined);
  }

  /**
   *
   * @param token
   */
  async invalidateFaunaDBToken(token: string) {
    await getClient(token)?.query<Expr>(Logout(true));
  }
}
