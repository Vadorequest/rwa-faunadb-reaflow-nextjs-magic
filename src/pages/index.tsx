import DisplayOnBrowserMount from '../components/DisplayOnBrowserMount';
import EditorContainer from '../components/editor/EditorContainer';
import Layout from '../components/Layout';
import { CanvasDataset } from '../types/CanvasDataset';
import { isBrowser } from '@unly/utils';
import { getCanvasDatasetFromLS } from '../utils/persistCanvasDataset';

export type Props = {
  canvasDataset: CanvasDataset | null;
}

/**
 * You can use your custom business logic here to fetch the canvasDataset from your data storage.
 * We simplified this demo by storing the canvasDataset in the browser LocalStorage instead.
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
 * A simple page that does nothing more than displaying a layout and the Reaflow canvas (EditorContainer).
 */
const IndexPage = (props: any) => {
  const { canvasDataset: canvasDatasetFromServer } = props; // We don't use canvasDatasetFromServer in this demo, but localstorage instead

  if(isBrowser()){
    window.initialCanvasDataset = getCanvasDatasetFromLS();
  }

  return (
    <Layout>
      {/* Only renders the EditorContainer on the browser because it's not server-side compatible */}
      <DisplayOnBrowserMount>
        <EditorContainer />
      </DisplayOnBrowserMount>
    </Layout>
  );
};

export default IndexPage;
