import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Link as ChakraLink } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    title = 'POC Next.js + Reaflow',
  } = props;

  return (
    <div
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

        .footer {
          height: ${settings.layout.footer.height}px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .svg-inline--fa {
          margin-right: 5px;
        }
      `}
    >
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <header>
        <nav className={'nav'}>
          <Link href="/">
            <a>
              <FontAwesomeIcon
                icon={['fas', 'home']}
              />
              Home
            </a>
          </Link>
          <a href={'https://github.com/Vadorequest/poc-nextjs-reaflow'}>
            <FontAwesomeIcon
              icon={['fab', 'github']}
            />
            GitHub
          </a>
        </nav>
      </header>

      {children}

      <footer className={'footer'}>
        <div>
          <FontAwesomeIcon
            icon={['fas', 'heart']}
          />
          Made with
          <ChakraLink
            href={'https://nextjs.org/'}
            isExternal
          >
            {' '}Next.js{' '}
            <ExternalLinkIcon mx="2px" />
          </ChakraLink>
          {' '}and{' '}
          <ChakraLink
            href={'https://github.com/reaviz/reaflow'}
            isExternal
          >
            {' '}Reaflow{' '}
            <ExternalLinkIcon mx="2px" />
          </ChakraLink>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
