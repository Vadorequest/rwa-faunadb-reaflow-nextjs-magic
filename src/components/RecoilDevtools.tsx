import React from 'react';
import DockMonitor from 'recoil-devtools-dock';
import LogMonitor from 'recoil-devtools-log-monitor';
import { RecoilLogger } from 'recoil-devtools-logger';
import DisplayOnBrowserMount from './DisplayOnBrowserMount';

export const RecoilDevtools = () => (
  <DisplayOnBrowserMount>
    <RecoilLogger />
    <DockMonitor
      toggleVisibilityKey="ctrl-h"
      changePositionKey="ctrl-q"
      changeMonitorKey="ctrl-m"
      defaultIsVisible
    >
      <LogMonitor />
    </DockMonitor>
  </DisplayOnBrowserMount>
);
