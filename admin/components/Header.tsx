import * as React from 'react';
import { slide as Menu } from 'react-burger-menu'
import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="Header">
      <Menu pageWrapId={ 'page-wrap' } outerContainerId={ 'outer-container' } width={ 275 }>
        <NavLink className="Menu__Item" activeClassName="Menu__Item--Active" to="/admin/texts">Texts</NavLink>
        <NavLink className="Menu__Item" activeClassName="Menu__Item--Active" to="/admin/texters">Texters</NavLink>
      </Menu>
      <h2 className="Header__Title">Window lights</h2>
    </header>
  );
}