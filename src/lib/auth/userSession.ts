import Iron from '@hapi/iron';
import { MagicUserMetadata } from '@magic-sdk/admin';
import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { UserSession } from '../../types/auth/UserSession';
import {
  getTokenCookie,
  MAX_AGE,
  setTokenCookie,
} from './authCookies';

type EndpointRequest = NextApiRequest & {
  query: {};
};

const TOKEN_SECRET = process.env.TOKEN_SECRET as string;

if(!TOKEN_SECRET || TOKEN_SECRET?.length < 32){
  throw new Error(`You must define a "TOKEN_SECRET" environment variable of at least 32 characters in order to use authentication. Found "${TOKEN_SECRET}".`);
}

/**
 * Writes a login cookie token to the browser.
 *
 * Uses user metadata (provided by Magic), and augments them (using custom login logic).
 *
 * @param res
 * @param userMetadata
 */
export const setUserSession = async (res: NextApiResponse, userMetadata: MagicUserMetadata): Promise<void> => {
  const createdAt = Date.now();

  // Create a session object with a max age that we can validate later
  const userSession: UserSession = {
    ...userMetadata,
    createdAt,
    maxAge: MAX_AGE,
  };
  const token: string = await Iron.seal(userSession, TOKEN_SECRET, Iron.defaults);

  setTokenCookie(res, token);
};

/**
 * Returns the user session.
 *
 * Resolves the user session by unsealing the token contained in the cookie.
 *
 * @param req
 * @param res
 */
export const getUserSession = async (req: EndpointRequest, res?: NextApiResponse): Promise<UserSession | undefined> => {
  const token: string | null = getTokenCookie(req);

  if (!token) return;

  const session: UserSession = await Iron.unseal(token, TOKEN_SECRET, Iron.defaults);
  const expiresAt = session.createdAt + session.maxAge * 1000;

  // Validate the expiration date of the session
  if (Date.now() > expiresAt) {
    throw new Error('UserSession expired');
  }

  return session;
};
