import { css } from '@emotion/react';
import { isBrowser } from '@unly/utils';
import { Subscription } from 'faunadb/src/types/Stream';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useUserSession } from '../hooks/useUserSession';
import {
  OnInit,
  OnStart,
  OnUpdate,
} from '../types/faunadb/CanvasStream';
import { TypeOfRef } from '../types/faunadb/TypeOfRef';
import { initStream } from '../utils/canvasStream';

type Props = {
  onInit: OnInit;
  onUpdate: OnUpdate;
  setCanvasDocRef: Dispatch<SetStateAction<TypeOfRef | undefined>>;
}

/**
 * Handles the FaunaDB stream to the Canvas document.
 *
 * Handles lifecycle (init/close).
 */
const FaunaDBCanvasStream: React.FunctionComponent<Props> = (props) => {
  const {
    onInit,
    onUpdate,
    setCanvasDocRef,
  } = props;

  // Used to avoid starting several streams from the same browser
  const [hasStreamStarted, setHasStreamStarted] = useState<boolean>(false);
  const [stream, setStream] = useState<Subscription | undefined>(undefined);
  const [canvasRef, setCanvasRef] = useState<TypeOfRef | undefined>(undefined);
  const [startedAt, setStartedAt] = useState<number | undefined>(undefined);
  const user = useUserSession();

  if (!isBrowser()) {
    return null;
  }

  const onStart: OnStart = (stream: Subscription, canvasRef: TypeOfRef, at: number) => {
    setStream(stream);
    setCanvasRef(canvasRef);
    setCanvasDocRef(canvasRef);
    setStartedAt(at);
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
      console.log('Closing stream.');
      // If the stream was already started, then it means the user has changed (logged in, or logged out)
      // In such case, we unsubscribe to the stream and restart it
      stream?.close();

      initStream(user, onStart, onInit, onUpdate);
    }
  }, [user?.id]);

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
