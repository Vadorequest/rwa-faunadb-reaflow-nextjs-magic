import { css } from '@emotion/react';
import React from 'react';

type Props = {
  blocksContainerWidth: string;
}

/**
 *
 */
const BlocksContainer: React.FunctionComponent<Props> = (props): JSX.Element | null => {
  const { blocksContainerWidth } = props;

  return (
    <div
      className={'blocks-container'}
      css={css`
        width: ${blocksContainerWidth};
        background-color: lightgrey;
      `}
    >
      Block 1
    </div>
  );
};

export default BlocksContainer;
