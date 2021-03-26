import * as React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { PrivateRoute } from '../component/route';
import { LoginPage } from '../page/login';
import { RegisterPage } from '../page/register';
import { LandingPage } from '../page/landing';
import { ChatPage } from '../page/chat';

export const Routes = () => {
  return(
    <Router>
      <Switch>
        <PrivateRoute path="/chat/:groupId">
          <ChatPage/>
        </PrivateRoute>
        <Route path="/login">
          <LoginPage/>
        </Route>
        <Route path="/register">
          <RegisterPage/>
        </Route>
        <Route path="/">
          <LoginPage/>
        </Route>
      </Switch>
    </Router>
  );
}
