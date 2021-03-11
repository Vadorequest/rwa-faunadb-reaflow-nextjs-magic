import {
  css,
  Global,
} from '@emotion/react';
import React from 'react';

type Props = {}

/**
 * Those styles are applied
 *  - universally (browser + server)
 *  - globally (applied to all pages), through _app
 *
 * @param props
 */
const GlobalStyles: React.FunctionComponent<Props> = (props): JSX.Element => {

  return (
    <Global
      styles={css`
        
        // ----------- Animations utilities -----------
        .animated, // Compatible with animate.css v3
        .animate__animated // Compatible with animate.css v4 (breaking change, see https://animate.style/#usage)
        {
          // Delay control (latency)
          &.delay-100ms {
            animation-delay: 0.1s;
          }

          &.delay-200ms {
            animation-delay: 0.2s;
          }

          &.delay-400ms {
            animation-delay: 0.4s;
          }

          &.delay-600ms {
            animation-delay: 0.6s;
          }

          // Duration control (speed)
          &.duration-100ms {
            animation-duration: 0.1s;
          }

          &.duration-200ms {
            animation-duration: 0.2s;
          }

          &.duration-300ms {
            animation-duration: 0.3s;
          }

          &.duration-400ms {
            animation-duration: 0.4s;
          }

          &.duration-600ms {
            animation-duration: 0.6s;
          }

          &.duration-3000ms {
            animation-duration: 3s;
          }

          &.duration-6000ms {
            animation-duration: 6s;
          }
        }
      `}
    />
  );
};

export default GlobalStyles;
