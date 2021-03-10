import Expr from 'faunadb/src/types/Expr';
import { FaunadbToken } from '../../../types/faunadb/FaunadbToken';
import { User } from '../../../types/faunadb/User';
import {
  adminClient,
  getClient,
  q,
} from '../faunadb';

export class UserModel {
  async createUser(email: string): Promise<User | undefined> {
    return adminClient.query<User>(q.Create(q.Collection('users'), {
      data: { email },
    }));
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return adminClient.query<User>(
      q.Get(q.Match(q.Index('users_by_email'), email)),
    ).catch(() => undefined);
  }

  async obtainFaunaDBToken(user: User): Promise<string | undefined> {
    return adminClient.query<FaunadbToken>(
      q.Create(q.Tokens(), { instance: q.Select('ref', user) }),
    )
      .then((res: FaunadbToken): string | undefined => res?.secret)
      .catch(() => undefined);
  }

  async invalidateFaunaDBToken(token: string) {
    await getClient(token).query<Expr>(q.Logout(true));
  }
}
