import * as React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as ReactRouterLink
} from 'react-router-dom';
import { PrivateRoute } from './private';
import { LoginPage } from '../page/login';
import { Link } from '@chakra-ui/react'

export const Routes = () => {
  return(
    <Router>
      <Link as={ReactRouterLink} to="/">Home</Link>
      <Link as={ReactRouterLink} to="/login">Login</Link>
      <Link as={ReactRouterLink} to="/register">Register</Link>
      <Switch>
        <Route path="/login">
          <LoginPage/>
        </Route>
        <Route path="/register">

        </Route>
        <Route path="/">

        </Route>
      </Switch>
    </Router>
  );
}
