import { values } from 'faunadb';
import { FaunadbBaseFields } from './FaunadbBaseFields';

type Ref = values.Ref;

/**
 * A Token created by FaunaDB.
 *
 * @see https://docs.fauna.com/fauna/current/api/fql/functions/tokens?lang=javascript
 */
export type FaunadbToken = FaunadbBaseFields & {
  instance: Ref;
  secret: string;
  data?: any; // Optional, consider those as token metadata (not user's metadata)
}
