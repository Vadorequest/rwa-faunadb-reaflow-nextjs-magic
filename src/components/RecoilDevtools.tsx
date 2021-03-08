import React from 'react';
import DockMonitor from 'recoil-devtools-dock';
import LogMonitor from 'recoil-devtools-log-monitor';
import { RecoilLogger } from 'recoil-devtools-logger';
import DisplayOnBrowserMount from './DisplayOnBrowserMount';

/**
 * Adds Recoil dev tools for easier understanding and debug of what happens in the Recoil store.
 * Enabled in development mode only.
 *
 * @see https://github.com/ulises-jeremias/recoil-devtools
 */
export const RecoilDevtools = () => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <DisplayOnBrowserMount>
      <RecoilLogger />
      <DockMonitor
        toggleVisibilityKey="ctrl-h"
        changePositionKey="ctrl-q"
        changeMonitorKey="ctrl-m" // Unnecessary for our app, because we only have one Recoil store
        defaultIsVisible={false}
      >
        <LogMonitor />
      </DockMonitor>
    </DisplayOnBrowserMount>
  );
};
