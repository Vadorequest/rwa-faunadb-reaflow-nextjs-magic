import { MagicUserMetadata } from '@magic-sdk/admin';
import { TypeOfRef } from './faunadb/TypeOfRef';

export type UserMetadataWithAuth = MagicUserMetadata & {
  /**
   * FaunaDB authentication token associated with the user.
   *
   * Doesn't hold any permission by itself, but is attached to roles instead (Editor) which define permissions.
   */
  faunaDBToken: string;

  /**
   * Ref of the user in FaunaDB.
   */
  ref: TypeOfRef;

  /**
   * ID of the user in FaunaDB.
   */
  id: string;
}
