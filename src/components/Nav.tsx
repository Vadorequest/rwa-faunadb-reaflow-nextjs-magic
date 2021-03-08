import { QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Flex,
  Spacer,
  Tooltip,
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
            You are currently working on a shared document, updated in real-time by any visitor.
          </Box>
        </Center>
      </nav>
    </header>
  );
};

export default Nav;
