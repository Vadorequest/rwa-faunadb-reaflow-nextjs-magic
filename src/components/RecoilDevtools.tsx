import React from "react";
import { RecoilLogger } from "recoil-devtools-logger";
import LogMonitor from "recoil-devtools-log-monitor";
import DockMonitor from "recoil-devtools-dock";
import DisplayOnBrowserMount from "./DisplayOnBrowserMount";

export const Devtools = () => (
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
