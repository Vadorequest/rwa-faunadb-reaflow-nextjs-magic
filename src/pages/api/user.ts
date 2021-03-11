import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { getUserSession } from '../../lib/auth/userSession';
import { UserSession } from '../../types/auth/UserSession';

export type ApiGetUserResult = {
  user: UserSession | null;
}

type EndpointRequest = NextApiRequest & {
  query: {};
};

/**
 * Returns the user session from the server-only cookie.
 *
 * Because the cookie containing the user session token can only be read by the server, we must use an API endpoint to retrieve it.
 *
 * @param req
 * @param res
 */
export const user = async (req: EndpointRequest, res: NextApiResponse): Promise<void> => {
  const userSession: UserSession | undefined = await getUserSession(req);
  // TODO fetch user's data
  const result: ApiGetUserResult = {
    user: userSession || null,
  };

  res.status(200).json(result);
};

export default user;
