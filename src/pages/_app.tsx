import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import 'animate.css/animate.min.css'; // Loads animate.css CSS file. See https://github.com/daneden/animate.css
import {
  NextComponentType,
  NextPageContext,
} from 'next';
import { Router } from 'next/router';
import React from 'react';
import { RecoilRoot } from 'recoil';
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
 * The extendTheme give the abilities to create custom theme for every chakra component
 *
 * Modify it to change style of button
 */

const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        bgColor: "#DBE1FF",
        bg: "#DBE1FF",
        background: "#DBE1FF",
        color: "#0028FF",
        margin: "5px",
        _hover: {
          bgColor: "#0028FF",
          bg: "#0028FF",
          background: "#0028FF",
          color: "#DBE1FF",
        },
      },
    },
  },
})

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
    <ChakraProvider theme={theme}>
      <RecoilRoot>
        {/* Dev tools for Recoil */}
        <RecoilDevtools />

        {/* Utility component allowing to use the Recoil state outside of a React component */}
        <RecoilExternalStatePortal />

        <Component {...pageProps} />
      </RecoilRoot>
    </ChakraProvider>
  );
};

export default App;
