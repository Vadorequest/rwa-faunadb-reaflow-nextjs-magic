import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { setLoginSession } from '../../lib/auth';
import { magic } from '../../lib/magic';

type EndpointRequest = NextApiRequest & {
  query: {};
};

export const login = async (req: EndpointRequest, res: NextApiResponse): Promise<void> => {
  try {
    const didToken = req?.headers?.authorization?.substr(7);
    const metadata = await magic?.users?.getMetadataByToken(didToken);
    const session = { ...metadata };

    await setLoginSession(res, session);

    res.status(200).send({ done: true });
  } catch (error) {
    res.status(error.status || 500).end(error.message);
  }
};

export default login;
