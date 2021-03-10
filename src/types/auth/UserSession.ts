import { UserMetadataWithAuth } from '../UserMetadataWithAuth';

export type UserSession = UserMetadataWithAuth & {
  createdAt: number;
  maxAge: number;
};
