import * as React from 'react';

type ACTIONTYPE = 
  | { type: 'username'; payload: string };

// initial reducer state
const initialState = {
  username: ''
}

export const StoreContext = React.createContext<{
  state: typeof initialState;
  dispatch: React.Dispatch<any>;
}>({state: initialState, dispatch: () => null})

// reducer
function reducer(state:typeof initialState, action:ACTIONTYPE){
  switch(action.type){
    case 'username':
      return {...state, username: action.payload};
    default: 
      return state;
  }
}

// context that passes the reducer
interface StoreProviderProps {
  children: React.ReactNode,
}

export const StoreProvider = ({children}:StoreProviderProps) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return(
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}
