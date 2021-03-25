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
import { useUserSession } from '../hooks/useUserSession';
import settings from '../settings';
import { humanizeEmail } from '../utils/user';
import AuthFormModal from './AuthFormModal';

type Props = {}

const Nav: React.FunctionComponent<Props> = (props) => {
  const user = useUserSession();
  console.log('user', user);

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
          <Box
            p="2"
            fontSize="sm"
          >
            {
              user?.isAuthenticated ? (
                <Fragment>
                  Welcome <b><Tooltip label={user?.email}>{humanizeEmail(user?.email as string)}</Tooltip></b>!<br />
                  You are currently working on your personal document.
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
              user?.isAuthenticated ? (
                <Fragment>
                  Project: {user?.projects?.[0]?.label}
                </Fragment>
              ) : (
                null
              )
            }
          </Box>

          <Spacer />

          <Box p="2">
            {
              user?.isAuthenticated ? (
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
