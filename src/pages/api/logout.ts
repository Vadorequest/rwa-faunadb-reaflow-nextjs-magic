import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { getLoginSession } from '../../lib/auth/auth';
import { removeTokenCookie } from '../../lib/auth/auth-cookies';
import { magicAdmin } from '../../lib/auth/magicAdmin';
import { UserSession } from '../../types/auth/UserSession';

type EndpointRequest = NextApiRequest & {
  query: {};
};

export const logout = async (req: EndpointRequest, res: NextApiResponse): Promise<void> => {
  try {
    const session: UserSession | undefined = await getLoginSession(req);

    if (session?.issuer) {
      await magicAdmin.users.logoutByIssuer(session?.issuer as string);
      removeTokenCookie(res);
    }
  } catch (error) {
    console.error(error);
  }

  res.writeHead(302, { Location: '/' });
  res.end();
};

export default logout;
