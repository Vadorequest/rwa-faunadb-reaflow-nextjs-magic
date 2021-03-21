import {
  Box,
  Center,
} from '@chakra-ui/react';
import { css } from '@emotion/react';
import React from 'react';
import settings from '../settings';

type Props = {}

const Nav: React.FunctionComponent<Props> = (props) => {
  return (
    <header
      css={css`
        .nav {
          height: ${settings.layout.nav.height}px;

          a {
            margin-left: 10px;
            margin-right: 10px;
          }
        }
      `}
    >
      <nav className={'nav'}>
        <Center>
          <Box p="2">
            You are a guest working on your own document. Changes are automatically saved in the browser local storage and cannot be shared or seen by anyone else.
          </Box>
        </Center>
      </nav>
    </header>
  );
};

export default Nav;
