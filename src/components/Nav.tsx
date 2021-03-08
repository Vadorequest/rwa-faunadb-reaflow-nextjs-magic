import { QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
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
        <Flex>
          <Box p="2">
            You are currently <b>anonymous</b> and working on a shared document.
          </Box>

          <Spacer />

          <Box p="2">
            <Button variant={'primary'}>
              Log in
            </Button>
            <Button variant={'primary'}>
              Create account
              &nbsp;
              <Tooltip label="Creating an account will allow you to work on your own document" fontSize="md">
                <QuestionOutlineIcon />
              </Tooltip>
            </Button>
          </Box>
        </Flex>
      </nav>
    </header>
  );
};

export default Nav;
