import { css } from '@emotion/react';
import React from 'react';

type Props = {
  blocksContainerWidth: string;
}

const ContainerSeparator: React.FunctionComponent<Props> = (props) => {
  const { blocksContainerWidth } = props;

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
