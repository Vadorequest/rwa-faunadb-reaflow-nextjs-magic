import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { getLoginSession } from '../../lib/auth/auth';
import { UserSession } from '../../types/auth/UserSession';

type EndpointRequest = NextApiRequest & {
  query: {};
};

export const user = async (req: EndpointRequest, res: NextApiResponse): Promise<void> => {
  const session: UserSession | undefined = await getLoginSession(req);

  // After getting the session you may want to fetch for the user instead
  // of sending the session's payload directly, this example doesn't have a DB
  // so it won't matter in this case
  res.status(200).json({ user: session || null });
}

export default user;
