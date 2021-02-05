import {
  ChakraProvider,
  extendTheme,
} from '@chakra-ui/react';
import React from 'react';
import { RecoilRoot } from 'recoil';
import '../utils/wdyr';

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
};
const theme = extendTheme({ colors });

// @ts-ignore
export default function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </ChakraProvider>
  );
}
