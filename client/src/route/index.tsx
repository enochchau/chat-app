import * as React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { Link } from '../component/route';
import { PrivateRoute } from '../component/route';
import { LoginPage } from '../page/login';
import { RegisterPage } from '../page/register';
import { LandingPage } from '../page/landing';
import { ChatPage } from '../page/chat';

export const Routes = () => {
  return(
    <Router>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/chat">Chat</Link>
      <Switch>
        <PrivateRoute path="/chat">
          <ChatPage/>
        </PrivateRoute>
        <Route path="/login">
          <LoginPage/>
        </Route>
        <Route path="/register">
          <RegisterPage/>
        </Route>
        <Route path="/">
          <LandingPage/>
        </Route>
      </Switch>
    </Router>
  );
}
