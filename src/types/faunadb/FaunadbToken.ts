import { values } from 'faunadb';
import { FaunadbBaseFields } from './FaunadbBaseFields';
import Ref = values.Ref;

export type FaunadbToken = FaunadbBaseFields & {
  instance: Ref;
  secret: string;
}
