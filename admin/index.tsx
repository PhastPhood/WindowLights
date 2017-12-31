import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Header from './components/Header';

import './stylesheets/main.scss';

ReactDOM.render(
  <div id="outer-container">
    <Header/>
    <main id='page-wrap'/>
  </div>,
  document.getElementById('root')
);
