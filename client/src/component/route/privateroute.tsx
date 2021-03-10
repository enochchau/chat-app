import * as React from 'react';
import {
  Route,
  Redirect,
  RouteProps
} from "react-router-dom";

export const PrivateRoute = ({children, ...rest}:RouteProps) => {
  function validate(){
    return true;
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