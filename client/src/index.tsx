import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Store from './store';
import ChatApp from './chatroom/app';

const AppWrapper = () => {
  return(
    <Store.Provider>
      <ChatApp/>
    </Store.Provider>
  );
}

ReactDOM.render(<AppWrapper/>, document.getElementById("root"))