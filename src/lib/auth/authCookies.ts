import {
  parse,
  serialize,
} from 'cookie';
import {
  NextApiRequest,
  NextApiResponse,
} from 'next';

type Cookies = { [key: string]: string }

const COOKIE_TOKEN_NAME = 'token';

export const MAX_AGE = 60 * 60 * 12; // 12 hours

/**
 * Writes the authentication cookie token in the browser.
 *
 * The cookie is only readable by the server (httpOnly), not by the browser.
 *
 * @param res
 * @param token
 *
 * @see https://owasp.org/www-community/HttpOnly
 */
export function setTokenCookie(res: NextApiResponse, token: string) {
  const cookie: string = serialize(COOKIE_TOKEN_NAME, token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });

  res.setHeader('Set-Cookie', cookie);
}

/**
 * Deletes the authentication cookie from the browser.
 *
 * @param res
 */
export function removeTokenCookie(res: NextApiResponse) {
  const cookie: string = serialize(COOKIE_TOKEN_NAME, '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
}

/**
 * Parse the cookies, if they've not been parsed already.
 *
 * Works for Next.js API routes and pages. (behavior is slightly different between both)
 *
 * @param req
 */
export function parseCookies(req: NextApiRequest): Cookies {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) return req.cookies;

  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie;
  return parse(cookie || '');
}

/**
 * Returns the user session token from the cookie.
 *
 * @param req
 */
export function getTokenCookie(req: NextApiRequest): string | null {
  const cookies: Cookies = parseCookies(req);
  return cookies?.[COOKIE_TOKEN_NAME];
}
