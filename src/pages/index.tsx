import { GraphQLClient } from 'graphql-request';
import { NextPage } from 'next';
import useAsyncEffect from 'use-async-effect';
import DisplayOnBrowserMount from '../components/DisplayOnBrowserMount';
import EditorContainer from '../components/editor/EditorContainer';
import Layout from '../components/Layout';
import INDEX_PAGE_QUERY from '../gql/pages';
import { useUserSession } from '../hooks/useUserSession';
import { CanvasDataset } from '../types/CanvasDataset';
import { Project } from '../types/graphql/graphql';

export type Props = {
  canvasDataset: CanvasDataset | null;
};

/**
 * You can use your custom business logic here to fetch the canvasDataset from your data storage.
 * We simplified this demo by storing the canvasDataset in the browser LocalStorage instead.
 *
 * TODO doc
 *
 * @see https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation
 */
export const getStaticProps = (): { props: Props } => {

  return {
    props: {
      canvasDataset: null,
    },
  };
};

/**
 * Index/home page.
 *
 * TODO doc
 */
const IndexPage: NextPage<Props> = (props): JSX.Element => {
  const userSession = useUserSession(); // "user" is "undefined" until a response is received from the API
  const gqlClient = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string);

  useAsyncEffect(async (): Promise<void> => {
    if (userSession?.isAuthenticated) {
      gqlClient.setHeaders({
        authorization: `Bearer ${userSession?.faunaDBToken}`,
      });

      const variables = {
        userId: userSession?.id,
      };

      try {
        const data = await gqlClient.request<Project[]>(INDEX_PAGE_QUERY, variables)

        console.log('data', data);

      } catch (e) {
        console.error(e);
      }
    }
  }, [userSession?.faunaDBToken]);

  return (
    <Layout>
      {/* Only renders the EditorContainer on the browser because it's not server-side compatible */}
      <DisplayOnBrowserMount
        // deps={[canvasDataset]}
      >
        {
          // Wait until the user has been fetched from the API endpoint
          userSession?.isSessionReady === true && (
            <EditorContainer />
          )
        }
      </DisplayOnBrowserMount>
    </Layout>
  );
};

export default IndexPage;
