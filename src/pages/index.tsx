import { NextPage } from 'next';
import React, { Fragment } from 'react';
import DisplayOnBrowserMount from '../components/DisplayOnBrowserMount';
import EditorContainer from '../components/editor/EditorContainer';
import Layout from '../components/Layout';
import { useUserSession } from '../hooks/useUserSession';
import { CanvasDataset } from '../types/CanvasDataset';

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

  return (
    <Fragment>
      {
        // Wait until the user has been fetched from the API endpoint
        userSession?.isSessionReady === true && (
          <Layout>
            {/* Only renders the page on the browser because it's not server-side compatible */}
            <DisplayOnBrowserMount>
              <EditorContainer />
            </DisplayOnBrowserMount>;
          </Layout>
        )
      }
    </Fragment>
  );
};

export default IndexPage;
