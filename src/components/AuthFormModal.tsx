import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import React, {
  useEffect,
  useState,
} from 'react';
import { magicClient } from '../lib/auth/magicClient';
import Animated3Dots from './Animated3Dots';

type Props = {
  mode: 'login' | 'create-account';
}

const LS_EMAIL_KEY = 'email';

/**
 * Login/Signup form.
 */
const AuthFormModal = (props: Props) => {
  const { mode } = props;
  const isLoginForm = mode === 'login';
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /**
   * Submits the form.
   *
   * Fetches a DID token from Magic API.
   * Fetches our internal /api/login endpoint which creates the authentication cookie.
   * Once the cookie is set, the "useUserSession" hook will return the currently authenticated user.
   *
   * The same function is used for both account creation and login.
   * There are 2 buttons but it's only visual, there is no difference between both, they both call the same /api/login endpoint which handles both.
   *
   * @param event
   *
   * @see https://docs.magic.link/decentralized-id#what-is-a-did-token What is a DID token?
   * @see https://docs.magic.link/client-sdk/web/api-reference#loginwithmagiclink
   */
  const onSubmit = async (event: MouseEvent): Promise<void> => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      localStorage?.setItem(LS_EMAIL_KEY, email);

      try {
        const didToken = await magicClient.auth.loginWithMagicLink({
          email: email,
          showUI: true,
        });
        console.info('User has logged in');
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + didToken,
          },
          body: JSON.stringify({ email }),
        });

        if (res.status === 200) {
          // The user is now authenticated (cookie has been set on the browser) to both Magic and FaunaDB
          onClose();

          // Force refresh the page
          window.location.href = '/';
        } else {
          throw new Error(await res.text());
        }
      } catch (error) {
        console.error('An unexpected error happened occurred:', error);
      }
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * Automatically loads the previous email used from localstorage.
   */
  useEffect(() => {
    try {
      setEmail(localStorage?.getItem(LS_EMAIL_KEY) || '');
    } catch (e) {
      console.error(e);
    }
  }, [mode]);

  /**
   * Preloads the static assets required to render the Magic iframe context.
   *
   * Makes the iframe display faster the first time the user loads it (better UX).
   *
   * @see https://docs.magic.link/client-sdk/web/api-reference#preload
   */
  useEffect(() => {
    magicClient.preload();
  }, []);

  return (
    <>
      <Button
        onClick={onOpen}
        variant={'primary'}
      >
        {isLoginForm ? 'Log in' : 'Create account'}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isLoginForm ? 'Log in' : 'Create account'}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Input
              type={'email'}
              placeholder={'Your email'}
              onChange={(event) => setEmail(event.target.value)}
              value={email}
              autoFocus
            />
          </ModalBody>

          <ModalFooter>
            {
              !isSubmitting && (
                <Button
                  mr={3}
                  onClick={onClose}
                  variant="ghost"
                >
                  Close
                </Button>
              )
            }

            <Button
              colorScheme="blue"
              // @ts-ignore
              onClick={onSubmit}
            >
              Send
              {
                isSubmitting && (
                  <Animated3Dots fill={'white'} />
                )
              }
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuthFormModal;
