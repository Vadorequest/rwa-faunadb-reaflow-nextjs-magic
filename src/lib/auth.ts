import Iron from '@hapi/iron';
import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { UserSession } from '../types/auth/UserSession';
import {
  getTokenCookie,
  MAX_AGE,
  setTokenCookie,
} from './auth-cookies';

const TOKEN_SECRET = process.env.TOKEN_SECRET as string;

type EndpointRequest = NextApiRequest & {
  query: {};
};

export const setLoginSession = async (res: NextApiResponse, session: UserSession): Promise<void> => {
  const createdAt = Date.now();
  // Create a session object with a max age that we can validate later
  const obj = { ...session, createdAt, maxAge: MAX_AGE };
  const token = await Iron.seal(obj, TOKEN_SECRET, Iron.defaults);

  setTokenCookie(res, token);
};

export const getLoginSession = async (req: EndpointRequest, res?: NextApiResponse): Promise<UserSession | undefined> => {
  const token = getTokenCookie(req);

  if (!token) return;

  const session = await Iron.unseal(token, TOKEN_SECRET, Iron.defaults);
  const expiresAt = session.createdAt + session.maxAge * 1000;

  // Validate the expiration date of the session
  if (Date.now() > expiresAt) {
    throw new Error('UserSession expired');
  }

  return session;
};
