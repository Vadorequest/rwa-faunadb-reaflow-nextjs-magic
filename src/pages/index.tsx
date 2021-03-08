import { isBrowser } from '@unly/utils';
import { useState } from 'react';
import DisplayOnBrowserMount from '../components/DisplayOnBrowserMount';
import EditorContainer from '../components/editor/EditorContainer';
import Layout from '../components/Layout';
import { setRecoilExternalState } from '../components/RecoilExternalStatePortal';
import { startStreamingCanvasDataset } from '../lib/faunadbClient';
import { canvasDatasetSelector } from '../states/canvasDatasetSelector';
import { CanvasDataset } from '../types/CanvasDataset';

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
 * A simple page that does nothing more than displaying a layout and the Reaflow canvas (EditorContainer),
 * after it has initialized the global "initialCanvasDataset" browser variable, which is used by the nodesSelector and edgesSelector Recoil state managers.
 */
const IndexPage = (props: any) => {
  const [canvasDataset, setCanvasDataset] = useState<CanvasDataset | undefined>(undefined);

  // Used to know when the app is ready to be rendered (when the data have been fetched from DB)
  const [isReadyToRender, setIsReadyToRender] = useState<boolean>(false);

  // Used to avoid starting several streams from the same browser
  const [isLoadingDataFromDB, setIsLoadingDataFromDB] = useState<boolean>(false);

  /**
   * Gets the canvas dataset stored in the browser localstorage and makes it available in the global "window" object.
   * The window.initialCanvasDataset will be used by the nodes/edges atom during their initialisation.
   *
   * XXX Doing it this way (instead of using a setState) ensures the Canvas is initially loaded with the proper dataset.
   *  And it won't have multiple re-renders due to mutating state, which in turn avoids lagginess during init.
   *  Also, it's a viable approach whether using the data from browser localstorage, or a real DB.
   */
  if (isBrowser()) {
    // Initialize the stream (only once)
    if (!isLoadingDataFromDB) {
      setIsLoadingDataFromDB(true);

      // Starts the stream between the browser and the FaunaDB using the default canvas document
      startStreamingCanvasDataset((canvasDatasetFromDB: CanvasDataset) => {
        console.log('canvasDatasetFromDB', canvasDatasetFromDB);
        setCanvasDataset(canvasDatasetFromDB);
        setIsReadyToRender(true);
      }, (canvasDatasetRemotelyUpdated: CanvasDataset) => {
        setRecoilExternalState(canvasDatasetSelector, canvasDatasetRemotelyUpdated);
      });
    }

    if (canvasDataset && setIsReadyToRender) {
      window.initialCanvasDataset = canvasDataset;
    }
  }

  return (
    <Layout>
      {/* Only renders the EditorContainer on the browser because it's not server-side compatible */}
      <DisplayOnBrowserMount
        deps={[canvasDataset]}
      >
        {
          isReadyToRender && (
            <EditorContainer />
          )
        }
      </DisplayOnBrowserMount>
    </Layout>
  );
};

export default IndexPage;
