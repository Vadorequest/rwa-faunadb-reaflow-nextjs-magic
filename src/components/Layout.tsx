import { css } from '@emotion/react';
import Head from 'next/head';
import Link from 'next/link';
import React, { ReactNode } from 'react';

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'POC Next.js + Reaflow' }: Props) => (
  <div
    css={css`
      .nav {
        height: 50px;
        display: flex;
      }
      
      .footer {
        height: 50px;
        display: flex;
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
        </Link>{' '}
      </nav>
    </header>

    {children}

    <footer className={'footer'}>
      <span>Made with Next.js and <a href={'https://github.com/reaviz/reaflow'}>Reaflow</a></span><br />
      <a href={'https://github.com/Vadorequest/poc-nextjs-reaflow'}>GitHub</a>
    </footer>
  </div>
);

export default Layout;
