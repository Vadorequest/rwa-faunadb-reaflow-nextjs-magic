import { isBrowser } from '@unly/utils';
import EditorContainer from '../components/editor/EditorContainer';
import Layout from '../components/Layout';
import BaseEdgeData from '../types/BaseEdgeData';
import BaseNodeData from '../types/BaseNodeData';
import { getCanvasDatasetFromLS } from '../utils/persistCanvasDataset';

/**
 * Index/home page.
 *
 * A simple page that does nothing more than displaying a layout and the Reaflow canvas (EditorContainer).
 */
const IndexPage = () => {
  let persistedNodes: BaseNodeData[] | undefined;
  let persistedEdges: BaseEdgeData[] | undefined;

  if (isBrowser()) {
    const persistedData = getCanvasDatasetFromLS();

    persistedNodes = persistedData?.nodes;
    persistedEdges = persistedData?.edges;
  }

  return (
    <Layout>
      <EditorContainer
        initialNodes={persistedNodes || []}
        initialEdges={persistedEdges || []}
      />
    </Layout>
  );
};

export default IndexPage;
