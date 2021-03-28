import { QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Input,
  Spacer,
  Tooltip,
} from '@chakra-ui/react';
import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
  Fragment,
  useState,
} from 'react';
import { useUserSession } from '../hooks/useUserSession';
import settings from '../settings';
import { Project } from '../types/graphql/graphql';
import { humanizeEmail } from '../utils/user';
import AuthFormModal from './AuthFormModal';

type Props = {}

const Nav: React.FunctionComponent<Props> = (props) => {
  const user = useUserSession();
  const activeProject: Project = user?.activeProject as Project;
  const [projectFormMode, setProjectFormMode] = useState<'display' | 'edit' | 'create'>('display');
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
                <Flex>
                  {
                    projectFormMode === 'edit' && (
                      <Input
                        defaultValue={activeProject?.label}
                        placeholder={'Project name'}
                        onKeyPress={(e) => {
                          if (e.code === 'Enter') {
                            // Save the new project label
                            setProjectFormMode('display');
                          }
                        }}
                        autoFocus={true}
                      />
                    )
                  }

                  {
                    projectFormMode === 'create' && (
                      <Input
                        placeholder={'New project name'}
                        onKeyPress={(e) => {
                          if (e.code === 'Enter') {
                            // Create the new project
                            setProjectFormMode('display');
                          }
                        }}
                        autoFocus={true}
                      />
                    )
                  }

                  {
                    projectFormMode === 'display' && (
                      <b>{activeProject?.label}</b>
                    )
                  }

                  <Tooltip label={`Edit title`}>
                    <Button
                      size={'xs'}
                      variant={'ghost'}
                      onClick={() => setProjectFormMode('edit')}
                    >
                      <FontAwesomeIcon icon={'edit'} />
                    </Button>
                  </Tooltip>

                  <Tooltip label={`Add a new project`}>
                    <Button
                      size={'xs'}
                      variant={'ghost'}
                      onClick={() => setProjectFormMode('create')}
                    >
                      <FontAwesomeIcon icon={'plus-circle'} />
                    </Button>
                  </Tooltip>
                </Flex>
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
