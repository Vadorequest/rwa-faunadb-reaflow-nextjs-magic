import Iron from '@hapi/iron'

const TOKEN_SECRET = process.env.TOKEN_SECRET as string;

if (!TOKEN_SECRET || TOKEN_SECRET?.length < 32) {
  throw new Error(`You must define a "TOKEN_SECRET" environment variable of at least 32 characters in order to use authentication. Found "${TOKEN_SECRET}".`);
}

/**
 * Encrypts the data into a token (as string).
 *
 * @param data
 */
export const encryptData = async <Data>(data: Data): Promise<string> => Iron.seal(data, TOKEN_SECRET, Iron.defaults);

/**
 * Decrypts a token and returns the data contains within.
 *
 * @param token
 */
export const decryptToken = async <Data>(token: string): Promise<Data> => Iron.unseal(token, TOKEN_SECRET, Iron.defaults);
