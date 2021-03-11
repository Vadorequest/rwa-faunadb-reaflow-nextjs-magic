import { ChakraProvider } from '@chakra-ui/react';
import 'animate.css/animate.min.css'; // Loads animate.css CSS file. See https://github.com/daneden/animate.css
import {
  NextComponentType,
  NextPageContext,
} from 'next';
import { Router } from 'next/router';
import React from 'react';
import { RecoilRoot } from 'recoil';
import GlobalStyles from '../components/GlobalStyles';
import { RecoilDevtools } from '../components/RecoilDevtools';
import { RecoilExternalStatePortal } from '../components/RecoilExternalStatePortal';
import '../utils/fontAwesome';

type Props = {
  Component: NextComponentType<NextPageContext>; // Page component, not provided if pageProps.statusCode is 3xx or 4xx
  err?: Error; // Only defined if there was an error
  pageProps: any; // Props forwarded to the Page component
  router?: Router; // Next.js router state
};

/**
 * This file is the entry point for all pages, it initialize all pages.
 *
 * It can be executed server side or browser side.
 *
 * @see https://nextjs.org/docs/advanced-features/custom-app Custom _app
 * @see https://nextjs.org/docs/basic-features/typescript#custom-app TypeScript for _app
 */
const App: React.FunctionComponent<Props> = (props): JSX.Element => {
  const { Component, pageProps } = props;

  return (
    <ChakraProvider>
      <RecoilRoot>
        {/* Dev tools for Recoil */}
        <RecoilDevtools />

        {/* Utility component allowing to use the Recoil state outside of a React component */}
        <RecoilExternalStatePortal />

        <GlobalStyles />
        <Component {...pageProps} />
      </RecoilRoot>
    </ChakraProvider>
  );
};

export default App;
