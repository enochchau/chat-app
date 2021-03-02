import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Store from './store';
import ChatApp from './chatroom/app';

const App = () => {
  return(
    <Store.Provider>
      <ChatApp/>
    </Store.Provider>
  );
}

ReactDOM.render(<App/>, document.getElementById("root"))