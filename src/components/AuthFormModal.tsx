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
import { Magic } from 'magic-sdk';
import React, {
  useEffect,
  useState,
} from 'react';

type Props = {
  mode: 'login' | 'create-account';
}

const LS_EMAIL_KEY = 'email';

const AuthFormModal = (props: Props) => {
  const { mode } = props;
  const isLoginForm = mode === 'login';
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState<string>('');

  const onSubmit = async () => {
    console.log('email', email);
    try {
      localStorage?.setItem(LS_EMAIL_KEY, email);

      try {
        const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY as string);
        const didToken = await magic.auth.loginWithMagicLink({
          email: email,
        });
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
        } else {
          throw new Error(await res.text());
        }
      } catch (error) {
        console.error('An unexpected error happened occurred:', error);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    try {
      setEmail(localStorage?.getItem(LS_EMAIL_KEY) || '');
    } catch (e) {
      console.log(e);
    }
  }, [mode]);

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
            <Button
              mr={3}
              onClick={onClose}
              variant="ghost"
            >
              Close
            </Button>
            <Button
              colorScheme="blue"
              onClick={onSubmit}
            >
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuthFormModal;
