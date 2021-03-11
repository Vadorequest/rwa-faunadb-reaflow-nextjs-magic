import { isBrowser } from '@unly/utils';
import React, {
  useEffect,
  useState,
} from 'react';
import { UserSession } from '../types/auth/UserSession';
import {
  OnInit,
  OnUpdate,
} from '../types/faunadb/CanvasStream';
import { initStream } from '../utils/canvasStream';
import { useUser } from './hooks/useUser';

type Props = {
  onInit: OnInit;
  onUpdate: OnUpdate;
}

/**
 * TODO
 */
const FaunaDBCanvasStream: React.FunctionComponent<Props> = (props) => {
  const {
    onInit,
    onUpdate,
  } = props;

  // Used to avoid starting several streams from the same browser
  const [hasStreamStarted, setHasStreamStarted] = useState<boolean>(false);
  const user: UserSession | null = useUser() as UserSession | null;

  if (!isBrowser()) {
    return null;
  }

  useEffect(() => {
    if (!hasStreamStarted) {
      setHasStreamStarted(true);

      initStream(user, onInit, onUpdate);
    }
  }, []);

  return null;
};

export default FaunaDBCanvasStream;
