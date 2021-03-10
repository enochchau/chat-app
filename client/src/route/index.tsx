import * as React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { PrivateRoute } from '../component/route';
import { LoginPage } from '../page/login';
import { RegisterPage } from '../page/register';
import { Link } from '../component/route';

export const Routes = () => {
  return(
    <Router>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Switch>
        <Route path="/login">
          <LoginPage/>
        </Route>
        <Route path="/register">
          <RegisterPage/>
        </Route>
        <Route path="/">

        </Route>
      </Switch>
    </Router>
  );
}
