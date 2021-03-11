import { isBrowser } from '@unly/utils';
import { getClient } from './faunadb';

const FAUNADB_SERVER_SECRET_KEY = process.env.FAUNADB_SERVER_SECRET_KEY as string;

if (!FAUNADB_SERVER_SECRET_KEY || FAUNADB_SERVER_SECRET_KEY?.length < 32) {
  throw new Error(`You must define a "FAUNADB_SERVER_SECRET_KEY" environment variable in order to use authentication. Found "${FAUNADB_SERVER_SECRET_KEY}".`);
}

/**
 * Initialize a FaunaDB admin instance (on the server).
 *
 * Acts as a singleton.
 * Won't crash if called on the browser (universal).
 *
 * @see https://docs.fauna.com/fauna/current/tutorials/crud.html?lang=javascript#obtain-an-admin-key
 */
export const faunadbAdminClient = !isBrowser() ? getClient(FAUNADB_SERVER_SECRET_KEY) : null;
