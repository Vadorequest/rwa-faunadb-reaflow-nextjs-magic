import Iron from '@hapi/iron'

const CRYPTO_TOKEN_SECRET = process.env.CRYPTO_TOKEN_SECRET as string;

if (!CRYPTO_TOKEN_SECRET || CRYPTO_TOKEN_SECRET?.length < 32) {
  throw new Error(`You must define a "CRYPTO_TOKEN_SECRET" environment variable of at least 32 characters in order to use authentication. Found "${CRYPTO_TOKEN_SECRET}".`);
}

/**
 * Encrypts the data into a token (as string).
 *
 * @param data
 */
export const encryptData = async <Data>(data: Data): Promise<string> => Iron.seal(data, CRYPTO_TOKEN_SECRET, Iron.defaults);

/**
 * Decrypts a token and returns the data contains within.
 *
 * @param token
 */
export const decryptToken = async <Data>(token: string): Promise<Data> => Iron.unseal(token, CRYPTO_TOKEN_SECRET, Iron.defaults);
