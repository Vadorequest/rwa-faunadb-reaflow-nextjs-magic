import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { getUserSession } from '../../lib/auth/userSession';
import { UserSession } from '../../types/auth/UserSession';

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

  // After getting the session you may want to fetch for the user instead
  // of sending the session's payload directly, this example doesn't have a DB
  // so it won't matter in this case
  res.status(200).json({ user: userSession || null });
}

export default user;
