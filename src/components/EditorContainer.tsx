import { css } from '@emotion/react';
import { isBrowser } from '@unly/utils';
import React from 'react';
import BlocksContainer from './BlocksContainer';
import PlaygroundContainer from './PlaygroundContainer';

type Props = {}

/**
 * Displays the blocks container (left) and the playground (right).
 */
const EditorContainer: React.FunctionComponent<Props> = (props): JSX.Element | null => {
  if (!isBrowser()) {
    return null;
  }
  const blocksContainerWidth = '30vw';

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
      <BlocksContainer
        blocksContainerWidth={blocksContainerWidth}
      />

      <PlaygroundContainer
        blocksContainerWidth={blocksContainerWidth}
      />
    </div>
  );
};

export default EditorContainer;
