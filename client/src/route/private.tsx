import * as React from 'react';
import {
  Route,
  Redirect
} from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode
}

export const PrivateRoute = ({children, ...rest}:PrivateRouteProps) => {
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