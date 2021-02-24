import { css } from '@emotion/react';
import React, { MutableRefObject } from 'react';
import { CanvasRef } from 'reaflow';
import BlockPickerMenu from '../blocks/BlockPickerMenu';
import CanvasContainer from './CanvasContainer';

type Props = {
  canvasRef: MutableRefObject<CanvasRef | null>;
}

/**
 * @see https://github.com/reaviz/reaflow
 */
const PlaygroundContainer: React.FunctionComponent<Props> = (props): JSX.Element | null => {
  const {
    canvasRef,
  } = props;

  console.log('Playground render');

  return (
    <div
      className={'playground-container'}
      css={css`
        .background {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: #f5f5f5;
          background-size: 50px 50px;
          background-image: linear-gradient(90deg, #eaeaea 1px, transparent 0), linear-gradient(180deg, #eaeaea 1px, transparent 0);
          background-position: right -109px bottom -39px;
          transform: scale(1);
          z-index: -10000;
        }
      `}
    >
      <div className={'background'} />
      <CanvasContainer
        canvasRef={canvasRef}
      />

      <BlockPickerMenu />
    </div>
  );
};

export default PlaygroundContainer;
