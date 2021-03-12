import { FaunadbBaseFields } from './FaunadbBaseFields';
import { TypeOfRef } from './TypeOfRef';

/**
 * A Token created by FaunaDB.
 *
 * @see https://docs.fauna.com/fauna/current/api/fql/functions/tokens?lang=javascript
 */
export type FaunadbToken = FaunadbBaseFields & {
  instance: TypeOfRef;
  secret: string;
  data?: any; // Optional, consider those as token metadata (not user's metadata)
}
