import React from 'react';
import { Route, Switch } from 'react-router-dom';
import App from '../App';
import Products from '../Products';

const Routes = () => (
  <Switch>
    <Route exact={true} path="/" component={App} />
    <Route exact={true} path="/store/:store_id/products" component={Products} />
  </Switch>
);

export default Routes;