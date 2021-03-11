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

const AuthFormModal = (props: Props) => {
  const { mode } = props;
  const isLoginForm = mode === 'login';
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /**
   *
   * @param event
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
          onClose();

          // Refresh the page, which will automatically close the existing FaunaDB stream (linked to the shared document), and create a new one (linked to the user's document)
          // If we simply re-render, we might accidentally update the current shared document using the user's document (or vice-versa), because it updates at every re-render
          // XXX There might be a cleaner way to do that that doesn't require a full page refresh
          document.location.href = '/';
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

  useEffect(() => {
    try {
      setEmail(localStorage?.getItem(LS_EMAIL_KEY) || '');
    } catch (e) {
      console.error(e);
    }
  }, [mode]);

  useEffect(() => {
    magicClient.preload(); // See https://docs.magic.link/client-sdk/web/api-reference#preload
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
