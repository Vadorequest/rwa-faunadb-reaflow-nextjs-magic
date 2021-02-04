import { css } from '@emotion/react';
import Head from 'next/head';
import Link from 'next/link';
import React, { ReactNode } from 'react';

type Props = {
  children?: ReactNode
  title?: string
}

const Layout: React.FunctionComponent<Props> = (props) => {
  const {
    children,
    title = 'POC Next.js + Reaflow'
  } = props;

  return (
    <div
      css={css`
        .nav {
          height: 50px;
        }

        .footer {
          height: 50px;
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
