import * as React from 'react';
import {
  Route,
  Redirect,
  RouteProps
} from "react-router-dom";
import { getToken } from '../../api/token';

export const PrivateRoute = ({children, ...rest}:RouteProps) => {
  function validate(): boolean{
    return Boolean(getToken());
  }
  return(
    <Route  {...rest}
      render={({ location }) => 
        validate() 
        ? children 
        : <Redirect to={{pathname: "/", state: {from:location}}}/> 
      }
    />
  );
}