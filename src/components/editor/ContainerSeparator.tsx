import { css } from '@emotion/react';
import React from 'react';
import settings from '../../settings';

type Props = {}

const ContainerSeparator: React.FunctionComponent<Props> = (props) => {
  const blocksContainerWidth = settings.blocksContainer.width;

  return (
    <div
      className={'containers-separator'}
      css={css`
        position: absolute;
        top: 0;
        bottom: 0;
        left: ${blocksContainerWidth};
        width: 20px;
        margin: 0;
        background-color: white;
      `}
    />
  );
};

export default ContainerSeparator;
