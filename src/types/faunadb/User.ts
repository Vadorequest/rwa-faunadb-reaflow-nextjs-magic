import { FaunadbRecordBaseFields } from './FaunadbRecordBaseFields';

export type User = FaunadbRecordBaseFields<{
  email: string;
}>
