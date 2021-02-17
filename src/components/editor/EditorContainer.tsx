import { css } from '@emotion/react';
import React, {
  MutableRefObject,
  useRef,
} from 'react';
import { CanvasRef } from 'reaflow';
import settings from '../../settings';
import PlaygroundContainer from './PlaygroundContainer';

type Props = {};

/**
 * Displays the playground container.
 *
 * Use a relative position for the playground to use an absolute position based on this container relative position.
 * Takes as much space as possible (full page width, full page height minus the height of header/footer components).
 */
const EditorContainer: React.FunctionComponent<Props> = (props): JSX.Element | null => {

  /**
   * Used to create a reference to the canvas.
   *
   * XXX Unused in this file at the moment, but was necessary when using drag & drop features, so it was kept in case it'd be useful later.
   */
  const canvasRef: MutableRefObject<CanvasRef | null> = useRef<CanvasRef | null>(null);

  return (
    <div
      className={'editor-container'}
      css={css`
        display: flex;
        position: relative;
        width: 100vw;
        height: calc(100vh - ${settings.layout.nav.height}px - ${settings.layout.footer.height}px);
      `}
    >
      <PlaygroundContainer
        canvasRef={canvasRef}
      />
    </div>
  );
};

export default EditorContainer;
