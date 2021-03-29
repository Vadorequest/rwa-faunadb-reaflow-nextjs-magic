import { useToast } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { isBrowser } from '@unly/utils';
import { Subscription } from 'faunadb/src/types/Stream';
import now from 'lodash.now';
import React, {
  Dispatch,
  SetStateAction,
  useState,
} from 'react';
import { useDebouncedEffect } from '../hooks/useDebouncedEffect';
import { useUserSession } from '../hooks/useUserSession';
import {
  OnStreamedDocumentUpdate,
  OnStreamError,
  OnStreamInit,
  OnStreamStart,
} from '../types/faunadb/CanvasStream';
import { FaunaError } from '../types/faunadb/FaunaError';
import { TypeOfRef } from '../types/faunadb/TypeOfRef';
import { initStream } from '../utils/canvasStream';

type Props = {
  onInit: OnStreamInit;
  onUpdate: OnStreamedDocumentUpdate;
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
  const toast = useToast({
    position: 'bottom-right',
    duration: 10000,
    isClosable: true,
    status: 'error',
  });
  const user = useUserSession();
  const errors: { at: number, error: Error }[] = [];

  if (!isBrowser()) {
    return null;
  }

  /**
   * Triggered when the stream has started.
   *
   * @param stream
   * @param canvasRef
   * @param at
   */
  const onStreamStarted: OnStreamStart = (stream: Subscription, canvasRef: TypeOfRef, at: number) => {
    setStream(stream);
    setCanvasRef(canvasRef);
    setCanvasDocRef(canvasRef);
    setStartedAt(at);
  };

  /**
   * Stream error handling.
   *
   * @param error
   * @param restartStream
   */
  const onStreamError: OnStreamError = (error: FaunaError, restartStream) => {
    errors.push({ at: now(), error });

    // Display a toast for the end-user to understand something's wrong
    toast({
      title: `Streaming error - "${error?.name}"`,
      description: `${error?.description} (${error?.message})`,
    });

    // Protect against too many errors on the client
    // TODO This should be improved to consider only recent errors (last minute?) to avoid stopping long-running session by mistake
    if (errors?.length > 100) {
      console.error('Too many errors, real-time stream has been stopped.', errors);
    } else {
      if (error?.name === 'PermissionDenied') {
        // No permission, this isn't supposed to happen in our app
        console.error('Permission error');
        setTimeout(restartStream, 10000);
      } else {
        setTimeout(restartStream, 2000);
      }
    }
  };

  /**
   * Handles stream subscription.
   *
   * Handles stream initialization and changes when the user logs in and logs out.
   * Updates when the user changes.
   *
   * Debounced to avoid creating too many streams in a loop when things go wrong.
   */
  useDebouncedEffect(() => {
    console.log('FaunaDBCanvasStream useEffect', hasStreamStarted, user);
    if (!hasStreamStarted) {
      // If the stream hasn't started yet, it means it's the first time the stream is opened for this browser page (there were no stream opened previously)
      setHasStreamStarted(true);

      initStream(user, onStreamStarted, onInit, onUpdate, onStreamError);
    } else {
      console.log('Closing stream.');
      // If the stream was already started, then it means the user has changed (logged in, or logged out)
      // In such case, we unsubscribe to the stream and restart it
      stream?.close();

      initStream(user, onStreamStarted, onInit, onUpdate, onStreamError);
    }
  }, 1000, [
    user?.id,
    user?.activeProject?.canvas?.id,
  ]);

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
