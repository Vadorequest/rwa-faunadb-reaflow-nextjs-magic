import { FaunadbRecordBaseFields } from './FaunadbRecordBaseFields';

/**
 * User type in FaunaDB.
 */
export type User = FaunadbRecordBaseFields<{
  email: string;
}>
