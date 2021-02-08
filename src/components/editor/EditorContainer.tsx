import { css } from '@emotion/react';
import { isBrowser } from '@unly/utils';
import React, {
  MutableRefObject,
  useRef,
} from 'react';
import { CanvasRef } from 'reaflow';
import PlaygroundContainer from './PlaygroundContainer';

type Props = {}

/**
 * Displays the playground container.
 */
const EditorContainer: React.FunctionComponent<Props> = (props): JSX.Element | null => {
  if (!isBrowser()) {
    return null;
  }

  // Used to create a reference to the canvas so we can pass it to the hook so it has knowledge about the canvas
  const canvasRef: MutableRefObject<CanvasRef | null> = useRef<CanvasRef | null>(null);

  return (
    <div
      className={'editor-container'}
      css={css`
        display: flex;
        position: relative;
        width: 100vw;
        height: calc(100vh - 120px);
      `}
    >
      <PlaygroundContainer
        canvasRef={canvasRef}
      />
    </div>
  );
};

export default EditorContainer;
