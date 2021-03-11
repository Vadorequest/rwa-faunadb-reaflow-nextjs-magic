import { css } from '@emotion/react';
import { isBrowser } from '@unly/utils';
import { values } from 'faunadb';
import { Subscription } from 'faunadb/src/types/Stream';
import React, {
  useEffect,
  useState,
} from 'react';
import { useUser } from '../hooks/useUser';
import { UserSession } from '../types/auth/UserSession';
import {
  OnInit,
  OnStart,
  OnUpdate,
} from '../types/faunadb/CanvasStream';
import { initStream } from '../utils/canvasStream';

type Ref = values.Ref;

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
  const [stream, setStream] = useState<Subscription | undefined>(undefined);
  const [canvasRef, setCanvasRef] = useState<Ref | undefined>(undefined);
  const user: UserSession | null = useUser() as UserSession | null;

  if (!isBrowser()) {
    return null;
  }

  const onStart: OnStart = (stream: Subscription, canvasRef: Ref) => {
    setStream(stream);
    setCanvasRef(canvasRef);
  };

  /**
   * Handles stream subscription
   *
   * Handles stream initialization and changes when the user logs in and logs out.
   * Updates when the user changes.
   */
  useEffect(() => {
    console.log('FaunaDBCanvasStream useEffect', hasStreamStarted, user);
    if (!hasStreamStarted) {
      // If the stream hasn't started yet, it means it's the first time the stream is opened for this browser page (there were no stream opened previously)
      setHasStreamStarted(true);

      initStream(user, onStart, onInit, onUpdate);
    } else {
      // If the stream was already started, then it means the user has changed (logged in, or logged out)
      // In such case, we unsubscribe to the stream and restart it
      stream?.close();

      initStream(user, onStart, onInit, onUpdate);
    }
  }, [user]);

  // Display meta information about the current document, helps debugging/understanding which document is being updated
  return (
    <div
      css={css`
        position: absolute;
        right: 20px;
        bottom: 0px;
        font-style: italic;
        font-size: 8px;
      `}
    >
      {/* XXX I probably messed something up with FQL, when logged in, the "canvasRef" type is "Ref", but it's "Expr" otherwise */}
      Working on doc N°{canvasRef?.id || (canvasRef as any)?.raw?.id}
    </div>
  );
};

export default FaunaDBCanvasStream;
