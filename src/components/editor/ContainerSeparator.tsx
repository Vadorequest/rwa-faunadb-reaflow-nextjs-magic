import { css } from '@emotion/react';
import React from 'react';
import settings from '../../settings';

type Props = {}

/**
 * Unused, kept for later maybe.
 *
 * @deprecated
 */
const ContainerSeparator: React.FunctionComponent<Props> = (props) => {
  return (
    <div
      className={'containers-separator'}
      css={css`
        position: absolute;
        top: 0;
        bottom: 0;
        left: ${settings.blocksContainer.width};
        width: ${settings.containerSeparator.width};
        margin: 0;
        background-color: white;
      `}
    />
  );
};

export default ContainerSeparator;
