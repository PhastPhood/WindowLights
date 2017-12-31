import * as React from 'react';
import { push as Menu } from 'react-burger-menu'

export default function Header() {
  return (
    <header className="Header">
      <Menu pageWrapId={ 'page-wrap' } outerContainerId={ 'outer-container' } noOverlay width={ 275 }>
        <a id="Logs" className="Menu__Item" href="/">Logs</a>
        <a id="Texters" className="Menu__Item" href="/">Texters</a>
      </Menu>
      <h2 className="Header__Title">Window lights</h2>
    </header>
  );
}