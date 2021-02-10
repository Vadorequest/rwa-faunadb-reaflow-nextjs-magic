import { css } from '@emotion/react';
import Head from 'next/head';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import settings from '../settings';

type Props = {
  children?: ReactNode
  title?: string
}

/**
 * Layout meant to be shared by all Next.js pages.
 *
 * Simply displays a header, footer, and the Next.js page in between.
 */
const Layout: React.FunctionComponent<Props> = (props) => {
  const {
    children,
    title = 'POC Next.js + Reaflow'
  } = props;

  return (
    <div
      css={css`
        .nav {
          height: ${settings.layout.nav.height}px;
        }

        .footer {
          height: ${settings.layout.footer.height}px;
        }
      `}
    >
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <header className={'nav'}>
        <nav>
          <Link href="/">
            <a>Home</a>
          </Link>{' | '}
          <a href={'https://github.com/Vadorequest/poc-nextjs-reaflow'}>GitHub</a>
        </nav>
      </header>

      {children}

      <footer className={'footer'}>
        <div>
          Made with <a href={'https://nextjs.org/'}>Next.js</a> and <a href={'https://github.com/reaviz/reaflow'}>Reaflow</a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
