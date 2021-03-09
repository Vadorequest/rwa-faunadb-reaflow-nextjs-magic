import { MagicUserMetadata } from '@magic-sdk/admin';

export type UserSession = MagicUserMetadata & {
  createdAt: number;
  maxAge: number;
};
