import Head from 'next/head';
import React, { ReactNode } from 'react';
import Footer from './Footer';
import Nav from './Nav';

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
    title = 'POC Next.js + Reaflow',
  } = props;

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Nav />

      {children}

      <Footer />
    </div>
  );
};

export default Layout;
