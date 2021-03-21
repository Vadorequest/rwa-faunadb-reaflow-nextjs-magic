import faunadb from 'faunadb';
import { ClientConfig } from 'faunadb/src/types/Client';

/**
 * Alias to `faunadb.query`.
 *
 * It is recommended to use destructuration to make JS-FQL queries identical to native FQL queries.
 * This way, you can simply copy/past queries written in JS to the FQL Shell.
 *
 * @example `const { Get, Select } = q;`
 */
export const q = faunadb.query;

/**
 * Creates an authenticated FaunaDB client configured with the given `secret`.
 *
 * @see https://docs.fauna.com/fauna/current/drivers/javascript.html#instantiating-a-client-and-issuing-queries
 */
export function getClient(secret: string) {
  const options: ClientConfig = {
    secret,

    // Custom observer used to log responses for easier debug
    observer: (res, client) => {
      console.debug('FaunaDB response:', res, 'using secret:', secret);
    },
  };

  return new faunadb.Client(options);
}
