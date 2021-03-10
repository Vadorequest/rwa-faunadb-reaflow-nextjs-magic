import faunadb from 'faunadb'

const FAUNADB_SERVER_SECRET_KEY = process.env.FAUNADB_SERVER_SECRET_KEY as string;

if (!FAUNADB_SERVER_SECRET_KEY || FAUNADB_SERVER_SECRET_KEY?.length < 32) {
  throw new Error(`You must define a "FAUNADB_SERVER_SECRET_KEY" environment variable in order to use authentication. Found "${FAUNADB_SERVER_SECRET_KEY}".`);
}

/** Alias to `faunadb.query` */
export const q = faunadb.query

/**
 * Creates an authenticated FaunaDB client
 * configured with the given `secret`.
 */
export function getClient(secret: string) {
  return new faunadb.Client({ secret })
}

/** FaunaDB Client configured with our server secret. */
export const adminClient = getClient(FAUNADB_SERVER_SECRET_KEY)
