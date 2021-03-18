import { MagicUserMetadata } from '@magic-sdk/admin';
import { TypeOfRef } from './faunadb/TypeOfRef';

export type UserMetadataWithAuth = MagicUserMetadata & {
  faunaDBToken: string;
  ref: TypeOfRef;
  id: string;
}
