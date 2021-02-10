import EditorContainer from '../components/editor/EditorContainer';
import Layout from '../components/Layout';
import BaseEdgeData from '../types/BaseEdgeData';
import BaseNodeData from '../types/BaseNodeData';
import {
  createNodeFromDefaultProps,
  getDefaultNodePropsWithFallback,
} from '../utils/nodes';

const IndexPage = () => {
  const initialNodes: BaseNodeData[] = [
    createNodeFromDefaultProps(getDefaultNodePropsWithFallback('information')),
  ];
  const initialEdges: BaseEdgeData[] = [];

  return (
    <Layout>
      <EditorContainer
        initialNodes={initialNodes}
        initialEdges={initialEdges}
      />
    </Layout>
  );
};

export default IndexPage;
