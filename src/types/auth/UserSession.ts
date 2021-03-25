import { Project } from '../graphql/graphql';
import { UserMetadataWithAuth } from '../UserMetadataWithAuth';

/**
 * User session stored in the "token" cookie.
 */
export type UserSession = UserMetadataWithAuth & {

  /**
   * Whether the user is authenticated.
   */
  isAuthenticated: boolean;

  /**
   * Timestamp of creation.
   */
  createdAt: number;

  /**
   * Auto-expires when maxAge is reached (similar to TTL).
   *
   * If the cookie expires due to maxAge being reached, the authentication form won't ask for email link confirmation,
   * but will automatically log in the user instead. (it somehow remembers the user because of cookies and uses a light authentication)
   */
  maxAge: number;

  /**
   * Contains a UUID string that is generated on the client side.
   *
   * It's meant to track which session is being used by the user.
   * The id will change upon page refresh (it is, ephemeral).
   *
   * It is used by the FaunaDB stream to resolve whether updates published by the DB are coming from the same session,
   * and discard them if they're coming from the same session.
   */
  sessionEphemeralId: string;

  /**
   * Whether the session has been fetched from the API or is loading.
   *
   * If the query errors, it will return false. (we consider the session isn't ready in such case)
   */
  isSessionReady: boolean;

  /**
   * Error that might happen when fetching the session.
   */
  error?: Error;

  /**
   * Projects created by the user.
   */
  projects?: Project[];
};
