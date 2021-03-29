import { GenericObject } from '../GenericObject';
import { FaunadbBaseFields } from './FaunadbBaseFields';

export type FaunadbRecordBaseFields<Data extends GenericObject> = FaunadbBaseFields & {
  data: Data;
}
