import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Texters from './Texters';
import TextLog from './TextLog';

type MainProps = {
  id: string
}

export default function Main(props: MainProps) {
  return (
    <main id={ props.id }>
      <Switch>
        <Route exact path="/admin/texts" component={ TextLog }/>
        <Route exact path="/admin/texters" component={ Texters }/>
        <Redirect from="/admin" to="/admin/texts"/>
      </Switch>
    </main>
  );
}
