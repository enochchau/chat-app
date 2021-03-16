import * as React from 'react';
import { DecodedJwtUser, decodeToJwtUser, getToken } from './api/token';

type ACTIONTYPE = 
  | { type: 'store current user'; payload: DecodedJwtUser};

// REMEBER TO REMOVE THIS LATER
// initial reducer state
const initialState = {
  email: 'demo_user@demo.com',
  id: -1,
  name: 'demo name',
  avatar: "", // currently unused
}

export const StoreContext = React.createContext<{
  storeState: typeof initialState;
  storeDispatch: React.Dispatch<any>;
}>({storeState: initialState, storeDispatch: () => null})

// reducer
function reducer(state:typeof initialState, action:ACTIONTYPE){
  switch(action.type){
    case 'store current user':
      return {...state, email: action.payload.email, id: action.payload.id, name: action.payload.name};
    default: 
      return state;
  }
}

// context that passes the reducer
interface StoreProviderProps {
  children: React.ReactNode,
}
export const StoreProvider = ({children}:StoreProviderProps) => {
  const [storeState, storeDispatch] = React.useReducer(reducer, initialState);

  // look for a stored token to reinstate the session
  React.useEffect(() => {
    const token = getToken();
    if(token){
      const jwtUser = decodeToJwtUser(token);
      if(jwtUser){
        storeDispatch({type: 'store current user', payload: jwtUser})
      }
    }
  }, [storeDispatch]);

  return(
    <StoreContext.Provider value={{ storeState, storeDispatch }}>
      {children}
    </StoreContext.Provider>
  );
}
