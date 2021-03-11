import { MagicUserMetadata } from '@magic-sdk/admin';
import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { magicAdmin } from '../../lib/auth/magicAdmin';
import { setUserSession } from '../../lib/auth/userSession';
import { UserModel } from '../../lib/faunadb/models/userModel';
import { User } from '../../types/faunadb/User';
import { UserMetadataWithAuth } from '../../types/UserMetadataWithAuth';

type EndpointRequest = NextApiRequest & {
  query: {};
};

/**
 * Authenticates a user.
 *
 * Called when Magic Link returns a didToken after calling "loginWithMagicLink".
 * Called from AuthFormModal.
 *
 * Parses the authorization Bearer token (didToken), fetches the user's metadata and then generates a cookie containing the user session token.
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
    const userModel = new UserModel();

    if (!userMetadata?.email) {
      // This isn't supposed to happen, because Magic would have thrown an error before.
      // But it might happen if there is a bug in Magic itself.
      // In such case, there is nothing we can do and we should crash early.
      throw new Error(`User doesn't have an email. Value: "${userMetadata?.email}"`);
    }

    // Auto-detects new user sign-up when `getUserByEmail` resolves to `undefined`
    const user: User = (await userModel.getUserByEmail(userMetadata?.email) ?? await userModel.createUser(userMetadata?.email)) as User;
    console.log('Found user', user);

    // Generates a FaunaDB token specific associated to this user
    const faunaDBToken: string | undefined = await userModel.obtainFaunaDBToken(user);

    if(!faunaDBToken){
      // This isn't supposed to happen, because the user cannot not exist.
      // But it might happen if our "FAUNADB_SERVER_SECRET_KEY" doesn't have the required permission to create a token.
      // In such case, there is nothing we can do and we should crash early.
      throw new Error(`Couldn't obtain a FaunaDB token for ${userMetadata?.email}.`);
    }

    // Add the user token into the user metadata, so we can use it later to authenticate user actions using its own personal token
    const userMetadataWithAuth: UserMetadataWithAuth = {
      ...userMetadata,
      faunaDBToken,
      ref: user.ref,
      id: user.ref.id,
    };

    // Those metadata are then used to generate a login session (Magic metadata + custom login metadata)
    await setUserSession(res, userMetadataWithAuth);

    res.status(200).send({ done: true });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
};

export default login;
