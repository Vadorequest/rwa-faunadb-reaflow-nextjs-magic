import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { removeTokenCookie } from '../../lib/auth/authCookies';
import { magicAdmin } from '../../lib/auth/magicAdmin';
import { getUserSession } from '../../lib/auth/userSession';
import { UserModel } from '../../lib/faunadb/models/userModel';
import { UserSession } from '../../types/auth/UserSession';

type EndpointRequest = NextApiRequest & {
  query: {};
};

/**
 * Logs out the current user.
 *
 * Invalidates FaunaDB token.
 * Invalidates Magic token.
 * Deletes token cookie.
 *
 * @param req
 * @param res
 *
 * @see https://magic.link/posts/todomvc-magic-nextjs-fauna#5-logging-users-out Inspired from
 */
export const logout = async (req: EndpointRequest, res: NextApiResponse): Promise<void> => {
  try {
    const session: UserSession | undefined = await getUserSession(req);

    if (session?.issuer) {
      const userModel = new UserModel();

      // Invalidates both FaunaDB token and Magic token
      await Promise.all([
        userModel.invalidateFaunaDBToken(session?.faunaDBToken),
        magicAdmin.users.logoutByIssuer(session?.issuer as string),
      ]);

      removeTokenCookie(res);
    }
  } catch (error) {
    console.error(error);
  }

  res.writeHead(302, { Location: '/' });
  res.end();
};

export default logout;
