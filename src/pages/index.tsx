import { isBrowser } from '@unly/utils';
import EditorContainer from '../components/editor/EditorContainer';
import Layout from '../components/Layout';
import BaseEdgeData from '../types/BaseEdgeData';
import BaseNodeData from '../types/BaseNodeData';
import {
  createNodeFromDefaultProps,
  getDefaultNodePropsWithFallback,
} from '../utils/nodes';
import { getGraphDataFromLS } from '../utils/persistGraph';

/**
 * Index/home page.
 *
 * A simple page that does nothing more than displaying a layout and the Reaflow canvas (EditorContainer).
 */
const IndexPage = () => {
  const fallbackInitialNodes: BaseNodeData[] = [
    createNodeFromDefaultProps(getDefaultNodePropsWithFallback('information')),
  ];
  const fallbackInitialEdges: BaseEdgeData[] = [];
  let persistedNodes: BaseNodeData[] | undefined;
  let persistedEdges: BaseEdgeData[] | undefined;

  if (isBrowser()) {
    const persistedData = getGraphDataFromLS();

    persistedNodes = persistedData?.nodes;
    persistedEdges = persistedData?.edges;
  }

  return (
    <Layout>
      <EditorContainer
        initialNodes={persistedNodes || fallbackInitialNodes}
        initialEdges={persistedEdges || fallbackInitialEdges}
      />
    </Layout>
  );
};

export default IndexPage;
