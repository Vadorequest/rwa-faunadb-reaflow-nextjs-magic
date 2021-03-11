import { QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Spacer,
  Tooltip,
} from '@chakra-ui/react';
import { css } from '@emotion/react';
import React, { Fragment } from 'react';
import settings from '../settings';
import AuthFormModal from './AuthFormModal';
import { useUser } from './hooks/useUser';

type Props = {}

const Nav: React.FunctionComponent<Props> = (props) => {
  const user = useUser();

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
            {
              user ? (
                <Fragment>
                  Welcome <b>{user?.email}</b>! You are working on a shared document<i>, even though you have your own account</i>.
                </Fragment>
              ) : (
                <Fragment>
                  You are currently <b>anonymous</b> and working on a shared document.
                </Fragment>
              )
            }
          </Box>

          <Spacer />

          <Box p="2">
            {
              user ? (
                <a href="/api/logout">
                  <Button>Logout</Button>
                </a>
              ) : (
                <Fragment>
                  <AuthFormModal
                    mode={'login'}
                  />
                  <AuthFormModal
                    mode={'create-account'}
                  />
                  &nbsp;
                  <Tooltip label="Creating an account will allow you to work on your own document" fontSize="md">
                    <QuestionOutlineIcon />
                  </Tooltip>
                </Fragment>
              )
            }
          </Box>
        </Flex>
      </nav>
    </header>
  );
};

export default Nav;
