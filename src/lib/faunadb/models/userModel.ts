import Expr from 'faunadb/src/types/Expr';
import { GraphQLClient } from 'graphql-request';
import CREATE_CANVAS, { CreateCanvasMutationResult } from '../../../gql/mutations/project/createCanvas';
import CREATE_PROJECT, { CreateProjectMutationResult } from '../../../gql/mutations/project/createProject';
import UPDATE_PROJECT_LABEL, { UpdateProjectLabelMutationResult } from '../../../gql/mutations/project/updateProjectLabel';
import INDEX_PAGE_QUERY, { IndexPageQueryResult } from '../../../gql/queries/pages';
import { UserSession } from '../../../types/auth/UserSession';
import { FaunadbToken } from '../../../types/faunadb/FaunadbToken';
import { User } from '../../../types/faunadb/User';
import {
  Canvas,
  Project,
} from '../../../types/graphql/graphql';
import {
  getClient,
  q,
} from '../faunadb';
import { faunadbAdminClient } from '../faunadbAdminClient';

const {
  Create,
  Collection,
  Get,
  Index,
  Tokens,
  Match,
  Select,
  Logout,
} = q;

/**
 * Helps managing users in the FaunaDB database.
 *
 * @see https://magic.link/posts/todomvc-magic-nextjs-fauna#step-43-modifying-users-in-faunadb-and-issuing-sessions Inspired from
 */
export class UserModel {
  /**
   * Creates a new user in the "users" collection.
   *
   * @param email
   */
  async createUser(email: string): Promise<User | undefined> {
    return faunadbAdminClient?.query<User>(Create(Collection('Users'), {
      data: { email },
    }));
  }

  /**
   * Find a user using the "usersByEmail" index.
   *
   * Don't throw on failures because we want to auto-create users when they don't exist yet.
   *
   * @param email
   */
  async getUserByEmail(email: string): Promise<User | undefined> {
    return faunadbAdminClient?.query<User>(
      Get(Match(Index('usersByEmail'), email)),
    ).catch(() => undefined);
  }

  /**
   * Generates a FaunaDB Token for the user.
   *
   * The token is associated to the user instance.
   *
   * @param user
   *
   * @see https://docs.fauna.com/fauna/current/api/fql/functions/tokens?lang=javascript
   */
  async obtainFaunaDBToken(user: User): Promise<string | undefined> {
    return faunadbAdminClient?.query<FaunadbToken>(
      Create(Tokens(), { instance: Select('ref', user) }),
    ).then((res: FaunadbToken): string | undefined => res?.secret);
  }

  /**
   *
   * @param token
   */
  async invalidateFaunaDBToken(token: string) {
    await getClient(token)?.query<Expr>(Logout(true));
  }

  /**
   * Fetches all the user's projects.
   *
   * @param userSession
   */
  async getProjects(userSession: UserSession): Promise<Project[]> {
    const gqlClient = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string);
    gqlClient.setHeaders({
      authorization: `Bearer ${userSession?.faunaDBToken}`,
    });

    const variables = {
      userId: userSession?.id,
    };

    try {
      console.log('Running GQL query', INDEX_PAGE_QUERY, variables, gqlClient);
      const data = await gqlClient.request<IndexPageQueryResult>(INDEX_PAGE_QUERY, variables);

      console.log('data', data);

      return data?.projects || [];

    } catch (e) {
      console.error(JSON.stringify(e, undefined, 2));
      return [];
    }
  }

  /**
   * Updates a project's label.
   *
   * @param userSession
   * @param projectId
   * @param label
   */
  async updateProjectLabel(userSession: UserSession, projectId: string, label: string): Promise<Project> {
    const gqlClient = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string);
    gqlClient.setHeaders({
      authorization: `Bearer ${userSession?.faunaDBToken}`,
    });

    const variables = {
      projectId,
      label,
    };

    try {
      console.log('Running GQL query', UPDATE_PROJECT_LABEL, variables, gqlClient);
      const result = await gqlClient.request<UpdateProjectLabelMutationResult>(UPDATE_PROJECT_LABEL, variables);

      return result?.updatedProject;
    } catch (e) {
      console.error(JSON.stringify(e, undefined, 2));
      throw e;
    }
  }

  /**
   * Creates a project and link it to the current user.
   *
   * @param userSession
   * @param label
   */
  async createProject(userSession: UserSession, label: string): Promise<Project> {
    const gqlClient = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string);
    gqlClient.setHeaders({
      authorization: `Bearer ${userSession?.faunaDBToken}`,
    });

    const variables = {
      userId: userSession?.id,
      label,
    };

    try {
      console.log('Running GQL query', CREATE_PROJECT, variables, gqlClient);
      const result = await gqlClient.request<CreateProjectMutationResult>(CREATE_PROJECT, variables);

      return result?.createdProject;
    } catch (e) {
      console.error(JSON.stringify(e, undefined, 2));
      throw e;
    }
  }

  /**
   * Creates a canvas and link it to the current user.
   *
   * @param userSession
   * @param projectId
   */
  async createCanvas(userSession: UserSession, projectId: string): Promise<Canvas> {
    const gqlClient = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string);
    gqlClient.setHeaders({
      authorization: `Bearer ${userSession?.faunaDBToken}`,
    });

    const variables = {
      userId: userSession?.id,
      projectId,
    };

    try {
      console.log('Running GQL query', CREATE_CANVAS, variables, gqlClient);
      const result = await gqlClient.request<CreateCanvasMutationResult>(CREATE_CANVAS, variables);

      return result?.createdCanvas;
    } catch (e) {
      console.error(JSON.stringify(e, undefined, 2));
      throw e;
    }
  }

  /**
   * Creates a project and its canvas and link them to the current user.
   *
   * @param userSession
   * @param projectLabel
   */
  async createProjectWithCanvas(userSession: UserSession, projectLabel: string): Promise<{ project: Project; canvas: Canvas }> {
    const project: Project = await this.createProject(userSession, projectLabel);
    const canvas: Canvas = await this.createCanvas(userSession, project?.id);

    return {
      project,
      canvas,
    };
  }
}
