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
import ReactSelect from 'react-select';
import { useUserSession } from '../hooks/useUserSession';
import { UserModel } from '../lib/faunadb/models/userModel';
import settings from '../settings';
import { UserSession } from '../types/auth/UserSession';
import { Project } from '../types/graphql/graphql';
import { ReactSelectDefaultOption } from '../types/ReactSelect';
import { humanizeEmail } from '../utils/user';
import { mutateLocalUserActiveProjectLabel } from '../utils/userSession';
import AuthFormModal from './AuthFormModal';

type Props = {}

const Nav: React.FunctionComponent<Props> = (props) => {
  const userSession = useUserSession();
  const [projectFormMode, setProjectFormMode] = useState<'display' | 'edit' | 'create'>('display');
  console.log('user', userSession);
  const toast = useToast({
    isClosable: true,
    duration: 5000,
    position: 'bottom-right',
  });
  const projectAsReactSelectOptions: ReactSelectDefaultOption[] = userSession?.projects?.map((project: Project) => {
    return {
      value: project?.id as string,
      label: project?.label as string,
    };
  }) as ReactSelectDefaultOption[];

  return (
    <header
      css={css`
        .nav {
          height: ${settings.layout.nav.height}px;

          a {
            margin-left: 10px;
            margin-right: 10px;
          }

          .select-active-project {
            width: 200px;
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
                        defaultValue={userSession?.activeProject?.label}
                        placeholder={'Project name'}
                        onKeyPress={async (e) => {
                          if (e.code === 'Enter') {
                            const label: string = (e?.target as HTMLInputElement)?.value;
                            // Save the new project label
                            const userModel = new UserModel();

                            try {
                              // Update local cache immediately (while disabling revalidation to avoid fetching)
                              mutateLocalUserActiveProjectLabel(userSession as UserSession, label);

                              // Update the project in the DB, if this fails it'll be caught
                              const updatedProject = await userModel.updateProjectLabel(userSession as UserSession, userSession?.activeProject?.id as string, label);

                              toast({
                                title: `Project updated`,
                                description: `The project "${userSession?.activeProject?.label}" has been renamed to "${updatedProject?.label}"`,
                                status: 'success',
                              });
                            } catch (e) {
                              toast({
                                title: `Error`,
                                description: `The project "${userSession?.activeProject?.label}" couldn't be renamed. Error: "${e.message}"`,
                                status: 'error',
                                duration: null,
                              });
                            } finally {
                              // Refresh our local cache to make sure it's up-to-date
                              userSession?.refresh?.();
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
                        onKeyPress={async (e) => {
                          if (e.code === 'Enter') {
                            const label: string = (e?.target as HTMLInputElement)?.value;
                            // Save the new project label
                            const userModel = new UserModel();

                            try {
                              // Update local cache immediately (while disabling revalidation to avoid fetching)
                              // mutateLocalUserActiveProjectLabel(userSession as UserSession, label);

                              // Create the project in the DB, if this fails it'll be caught
                              const { project: createdProject } = await userModel.createProjectWithCanvas(userSession as UserSession, label);

                              toast({
                                title: `Project created`,
                                description: `The project "${createdProject?.label}" has been created."`,
                                status: 'success',
                              });
                            } catch (e) {
                              toast({
                                title: `Error`,
                                description: `The project "${label}" couldn't be created. Error: "${e.message}"`,
                                status: 'error',
                                duration: null,
                              });
                            } finally {
                              // Refresh our local cache to make sure it's up-to-date
                              userSession?.refresh?.();
                            }

                            setProjectFormMode('display');
                          }
                        }}
                        autoFocus={true}
                      />
                    )
                  }

                  {
                    projectFormMode === 'display' && (
                      <ReactSelect
                        className={'select-active-project'}
                        isMulti={false}
                        value={projectAsReactSelectOptions?.find((option: ReactSelectDefaultOption) => option?.value === userSession?.activeProject?.id)}
                        options={projectAsReactSelectOptions}
                        onChange={((selectedOption: ReactSelectDefaultOption) => {
                          console.log('selectedOption', selectedOption);
                        }) as any}
                      />
                    )
                  }

                  <Tooltip label={`Edit active project's title`}>
                    <Button
                      size={'xs'}
                      variant={'ghost'}
                      onClick={() => {
                        // Toggle display/edit
                        projectFormMode === 'display' ? setProjectFormMode('edit') : setProjectFormMode('display');
                      }}
                    >
                      <FontAwesomeIcon icon={projectFormMode === 'display' ? 'edit' : 'times-circle'} />
                    </Button>
                  </Tooltip>

                  {
                    projectFormMode === 'display' && (
                      <Tooltip label={`Add a new project`}>
                        <Button
                          size={'xs'}
                          variant={'ghost'}
                          onClick={() => setProjectFormMode('create')}
                        >
                          <FontAwesomeIcon icon={'plus-circle'} />
                        </Button>
                      </Tooltip>
                    )
                  }
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
