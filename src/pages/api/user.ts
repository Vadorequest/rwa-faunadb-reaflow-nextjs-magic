import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import {
  Cookies,
  parseCookies,
} from '../../lib/auth/authCookies';
import { getUserSession } from '../../lib/auth/userSession';
import { UserModel } from '../../lib/faunadb/models/userModel';
import { UserSession } from '../../types/auth/UserSession';
import { Project } from '../../types/graphql/graphql';

export type ApiGetUserResult = {
  user: UserSession | null;
}

type EndpointRequest = NextApiRequest & {
  query: {};
};

export const FETCH_USER_SESSION_ENDPOINT = '/api/user';

/**
 * Returns the user session from the server-only cookie.
 *
 * Because the cookie containing the user session token can only be read by the server, we must use an API endpoint to retrieve it.
 *
 * This endpoint is called every time a user refreshes the index page.
 *
 * @param req
 * @param res
 */
export const user = async (req: EndpointRequest, res: NextApiResponse): Promise<void> => {
  const userSession: UserSession | undefined = await getUserSession(req);
  const cookies: Cookies = parseCookies(req);

  // The cookie contains the UserSession object
  const result: ApiGetUserResult = {
    user: userSession || null,
  };

  // If the user is authenticated, fetch their projects and add them in the user session
  if (result?.user) {
    const userModel = new UserModel();
    let projects: Project[] = await userModel.getProjects(userSession as UserSession);

    // If no project exist, create the default one automatically
    if (!projects?.length) {
      const { project } = await userModel.createProjectWithCanvas(userSession as UserSession, 'Default');
      projects = [project];
    }

    result.user.projects = projects;

    // Resolve active project from cookies, fallback to first project found
    result.user.activeProject = projects?.find((project: Project) => project?.id === cookies?.activeProjectId) || projects[0];
  }

  res.status(200).json(result);
};

export default user;
