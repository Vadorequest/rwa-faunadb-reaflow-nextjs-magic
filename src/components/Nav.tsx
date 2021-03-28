import { QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Input,
  Spacer,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
  Fragment,
  useState,
} from 'react';
import { useUserSession } from '../hooks/useUserSession';
import { UserModel } from '../lib/faunadb/models/userModel';
import settings from '../settings';
import { UserSession } from '../types/auth/UserSession';
import { Project } from '../types/graphql/graphql';
import { humanizeEmail } from '../utils/user';
import AuthFormModal from './AuthFormModal';

type Props = {}

const Nav: React.FunctionComponent<Props> = (props) => {
  const userSession = useUserSession();
  const [activeProject, setActiveProject] = useState<Project>(userSession?.activeProject as Project);
  const [projectFormMode, setProjectFormMode] = useState<'display' | 'edit' | 'create'>('display');
  console.log('user', userSession);
  console.log('activeProject', activeProject);
  const toast = useToast({
    isClosable: true,
    duration: 5000,
    position: 'bottom-right',
  });

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
              userSession?.isAuthenticated ? (
                <Fragment>
                  Welcome <b><Tooltip label={userSession?.email}>{humanizeEmail(userSession?.email as string)}</Tooltip></b>!<br />
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
              userSession?.isAuthenticated ? (
                <Flex>
                  {
                    projectFormMode === 'edit' && (
                      <Input
                        defaultValue={activeProject?.label}
                        placeholder={'Project name'}
                        onKeyPress={async (e) => {
                          if (e.code === 'Enter') {
                            const label: string = (e?.target as HTMLInputElement)?.value;
                            // Save the new project label
                            const userModel = new UserModel();

                            try {
                              const updatedProject = await userModel.updateProjectLabel(userSession as UserSession, activeProject?.id, label);

                              // Update local cache immediately
                              // TODO This isn't clean, it'll only update the local component cache, we should rather have a shared state for this
                              //  But it does the job, and it's not an issue in this small app because the project's title is only shown in this component
                              setActiveProject({
                                ...activeProject,
                                ...updatedProject,
                              });

                              toast({
                                title: `Project updated`,
                                description: `The project "${activeProject?.label}" has been renamed to "${updatedProject?.label}"`,
                                status: 'success',
                              });
                            } catch (e) {
                              toast({
                                title: `Error`,
                                description: `The project "${activeProject?.label}" couldn't be renamed. Error: "${e.message}"`,
                                status: 'error',
                                duration: null,
                              });
                            }

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
              userSession?.isAuthenticated ? (
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
