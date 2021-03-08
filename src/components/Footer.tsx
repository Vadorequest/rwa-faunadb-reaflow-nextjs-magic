import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Link as ChakraLink } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import settings from '../settings';

type Props = {}

const Footer: React.FunctionComponent<Props> = (props) => {
  return (
    <footer
      className={'footer'}
      css={css`
        height: ${settings.layout.footer.height}px;
        display: flex;
        align-items: center;
        justify-content: center;

        .svg-inline--fa {
          margin-right: 5px;
        }
      `}
    >
      <div>
        <FontAwesomeIcon
          icon={['fas', 'heart']}
        />
        Made with
        <ChakraLink
          href={'https://nextjs.org/'}
          isExternal
          color="teal.500"
        >
          {' '}Next.js{' '}
          <ExternalLinkIcon mx="2px" />
        </ChakraLink>
        {' '}and{' '}
        <ChakraLink
          href={'https://github.com/reaviz/reaflow'}
          isExternal
          color="teal.500"
        >
          {' '}Reaflow{' '}
          <ExternalLinkIcon mx="2px" />
        </ChakraLink>
      </div>
    </footer>
  );
};

export default Footer;
