import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { getLoginSession } from '../../lib/auth';
import { removeTokenCookie } from '../../lib/auth-cookies';
import { magic } from '../../lib/magic';
import { UserSession } from '../../types/auth/UserSession';

type EndpointRequest = NextApiRequest & {
  query: {};
};

export const logout = async (req: EndpointRequest, res: NextApiResponse): Promise<void> => {
  try {
    const session: UserSession | undefined = await getLoginSession(req);

    if (session?.issuer) {
      await magic.users.logoutByIssuer(session?.issuer as string);
      removeTokenCookie(res);
    }
  } catch (error) {
    console.error(error);
  }

  res.writeHead(302, { Location: '/' });
  res.end();
};

export default logout;
