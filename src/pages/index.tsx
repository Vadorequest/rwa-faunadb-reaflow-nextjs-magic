import EditorContainer from '../components/editor/EditorContainer';
import Layout from '../components/Layout';

/**
 * Index/home page.
 *
 * A simple page that does nothing more than displaying a layout and the Reaflow canvas (EditorContainer).
 */
const IndexPage = () => {
  return (
    <Layout>
      <EditorContainer />
    </Layout>
  );
};

export default IndexPage;
