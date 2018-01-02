import * as React from 'react';
import * as ReactDOM from 'react-dom';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import { Store, createStore, applyMiddleware, compose } from 'redux';
import { BrowserRouter } from 'react-router-dom';

import 'react-table/react-table.css';

import Header from './components/Header';
import Main from './components/Main';
import reducer from './redux/reducer';

import './stylesheets/main.scss';

const initialState = {};
const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;
const store = createStore(reducer, initialState, composeEnhancers(applyMiddleware(thunkMiddleware)));

ReactDOM.render(
  <Provider store={ store }>
    <BrowserRouter>
      <div id="outer-container">
        <Header/>
        <Main id='page-wrap'/>
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
