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
import { decryptToken, encryptData } from './crypto';

type EndpointRequest = NextApiRequest & {
  query: {};
};

/**
 * Writes the user session cookie token to the browser.
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
  const token: string = await encryptData(userSession);

  setTokenCookie(res, token);
};

/**
 * Returns the user session.
 *
 * Resolves the user session by decrypting the token contained in the cookie.
 *
 * @param req
 * @param res
 */
export const getUserSession = async (req: EndpointRequest, res?: NextApiResponse): Promise<UserSession | undefined> => {
  const token: string | null = getTokenCookie(req);

  if (!token) return;

  const session: UserSession = await decryptToken(token);
  const expiresAt = session.createdAt + session.maxAge * 1000;

  // Validate the expiration date of the session
  if (Date.now() > expiresAt) {
    throw new Error('UserSession expired');
  }

  return session;
};
