import { MagicUserMetadata } from '@magic-sdk/admin';
import { values } from 'faunadb';
type Ref = values.Ref;

export type UserMetadataWithAuth = MagicUserMetadata &  {
  faunaDBToken: string;
  ref: Ref;
  id: string;
}
