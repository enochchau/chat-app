import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Store from './store';

const WSURL = 'ws://localhost:5000/chat';

interface InputBoxProps {
  onSubmit: React.FormEventHandler<HTMLFormElement>,
  onChange: React.FormEventHandler<HTMLInputElement>,
  value: string
}

const InputBox = ({onSubmit, onChange, value}: InputBoxProps) => {
  return(
    <form onSubmit={onSubmit}>
      <input 
        type="text" 
        placeholder="Enter a message..." 
        value={value}
        onChange={onChange}
      />
      <input type="submit" value="send"/>
    </form>
  );
}

interface ChatMessage {
  message: string,
  username: string,
}

const App = () => {
  const [value, setValue] = React.useState<string>('');
  const [chatMessages, setChatMessages] = React.useState<Array<ChatMessage>>([]);
  const { state, dispatch } = React.useContext(Store.Context);
  const ws = React.useRef<WebSocket | null>(null);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (state.username === ''){
      dispatch({type: "username", payload: value})
      
      ws.current = new WebSocket(WSURL);
      ws.current.onmessage = (message) => {
        let msg = JSON.parse(message.data);
        if (!msg['username']){

        }
        msg["message"]
      }

    } else {
      // send websocket message here
    }
  }

  const handleChange = (e:React.FormEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  }


  return(
    <div>
      {state.username === '' && 
        <h3>Please enter a username.</h3>
      }
      {state.username !== '' && 
        <h3>Welcome to Websocket Land, {state.username}</h3>
      }
      <InputBox
        onSubmit={handleSubmit}
        onChange={handleChange}
        value={value}
      />
    </div>
  );
}

const AppWrapper = () => {
  return(
    <Store.Provider>
      <App/>
    </Store.Provider>
  );
}

ReactDOM.render(<AppWrapper/>, document.getElementById("root"))