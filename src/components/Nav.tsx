import { css } from '@emotion/react';
import React from 'react';
import settings from '../settings';

type Props = {}

const Nav: React.FunctionComponent<Props> = (props) => {
  return (
    <header
      css={css`
        .nav {
          height: ${settings.layout.nav.height}px;
          display: flex;
          align-items: center;
          justify-content: center;

          a {
            margin-left: 10px;
            margin-right: 10px;
          }
        }

      `}
    >
      <nav className={'nav'}>

      </nav>
    </header>
  );
};

export default Nav;
