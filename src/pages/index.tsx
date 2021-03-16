import DisplayOnBrowserMount from '../components/DisplayOnBrowserMount';
import EditorContainer from '../components/editor/EditorContainer';
import Layout from '../components/Layout';
import { useUserSession } from '../hooks/useUserSession';
import { CanvasDataset } from '../types/CanvasDataset';

export type Props = {
  canvasDataset: CanvasDataset | null;
}

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
 * A simple page that does nothing more than displaying a layout and the Reaflow canvas (EditorContainer),
 * after it has initialized the global "initialCanvasDataset" browser variable, which is used by the nodesSelector and edgesSelector Recoil state managers.
 */
const IndexPage = (props: any) => {
  const user = useUserSession(); // "user" is "undefined" until a response is received from the API

  return (
    <Layout>
      {/* Only renders the EditorContainer on the browser because it's not server-side compatible */}
      <DisplayOnBrowserMount
        // deps={[canvasDataset]}
      >
        {
          // Wait until the user has been fetched from the API endpoint
          user?.isSessionReady === true && (
            <EditorContainer />
          )
        }
      </DisplayOnBrowserMount>
    </Layout>
  );
};

export default IndexPage;
