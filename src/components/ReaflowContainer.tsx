import { isBrowser } from '@unly/utils';
import React from 'react';
import { Canvas } from 'reaflow';

type Props = {}

/**
 * @see https://github.com/reaviz/reaflow
 */
const ReaflowContainer: React.FunctionComponent<Props> = (): JSX.Element | null => {
  if (!isBrowser()) {
    return null;
  }

  return (
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
      <Canvas
        nodes={[
          {
            id: '1',
            text: '1',
          },
          {
            id: '2',
            text: '2',
          },
        ]}
        edges={[
          {
            id: '1-2',
            from: '1',
            to: '2',
          },
        ]}
      />
    </div>
  );
};

export default ReaflowContainer;
