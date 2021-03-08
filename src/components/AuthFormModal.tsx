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
import React, { useState } from 'react';

type Props = {
  mode: 'log-in' | 'create-account';
}

const AuthFormModal = (props: Props) => {
  const { mode } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState<string>('');

  const isLoginForm = mode === 'log-in';

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
              type={'text'}
              placeholder={'Your email'}
              onChange={(event) => setEmail(event.target.value)}
              value={email}
              autoFocus
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Send</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuthFormModal;
