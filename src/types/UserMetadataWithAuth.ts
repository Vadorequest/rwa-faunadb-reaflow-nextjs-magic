import { MagicUserMetadata } from '@magic-sdk/admin';

export type UserMetadataWithAuth = MagicUserMetadata &  {
  faunaDBToken: string;
}
