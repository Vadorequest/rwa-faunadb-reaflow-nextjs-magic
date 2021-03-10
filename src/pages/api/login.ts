import { MagicUserMetadata } from '@magic-sdk/admin';
import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { setLoginSession } from '../../lib/auth/auth';
import { magicAdmin } from '../../lib/auth/magicAdmin';

type EndpointRequest = NextApiRequest & {
  query: {};
};

/**
 * Authenticates a user.
 *
 * Called when Magic Link returns a didToken after calling "loginWithMagicLink".
 * Called from AuthFormModal.
 *
 * Parses the authorization Bearer token (didToken), fetches the user's metadata and then generates a cookie containing the authentication token.
 *
 * @param req
 * @param res
 *
 * @see https://docs.magic.link/decentralized-id#what-is-a-did-token What is a DID token?
 * @see https://docs.magic.link/admin-sdk/node/api-reference#parseauthorizationheader
 * @see https://docs.magic.link/admin-sdk/php/laravel/api-reference#validate
 */
export const login = async (req: EndpointRequest, res: NextApiResponse): Promise<void> => {
  try {
    const didToken = magicAdmin.utils.parseAuthorizationHeader(req?.headers?.authorization || '');

    // XXX It is important to always validate the DID Token before using it. Will throw if invalid.
    magicAdmin.token.validate(didToken);

    // The Magic API returns a few metadata, including the issuer and the user email
    const userMetadata: MagicUserMetadata = await magicAdmin.users.getMetadataByToken(didToken);

    // Those metadata are then used to generate a login session (Magic metadata + custom login metadata)
    await setLoginSession(res, userMetadata);

    res.status(200).send({ done: true });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
};

export default login;
