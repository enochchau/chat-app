import { StoreContext } from '../store';
import * as React from 'react';
import { ChatMessage } from './chatmsg';
import { WSURL } from '../config';
import InputBox from '../deprecated/input';
import ChatList from '../deprecated/chatlist';

const ChatApp = () => {
  const [value, setValue] = React.useState<string>('');
  const [chatMessages, setChatMessages] = React.useState<Array<ChatMessage>>([]);
  const { state, dispatch } = React.useContext(StoreContext);
  const ws = React.useRef<WebSocket | null>(null);

  React.useEffect(() => {
    // close websocket on component unmount
    return function unmount(){
      if (ws.current !== null){
        ws.current.close();
      }
    }
  }, [])

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (state.username === ''){
      // this happens the first time the person visits the site
      dispatch({type: "username", payload: value})
      
      // configure websocket
      ws.current = new WebSocket(WSURL);
      ws.current.onmessage = (message) => {
        // add new messges the chat message arr
        let msg:ChatMessage = JSON.parse(message.data);
        if (msg['message'] && msg['username'] && msg['timestamp']){
          setChatMessages(chatMessages => [...chatMessages, msg]);
        }
      }

    } else if(ws.current !== null) {
      // send websocket message here
      let msg:ChatMessage = {username: state.username, message: value, timestamp: Date.now()};
      ws.current.send(JSON.stringify(msg));
    } else {
      console.error("something went wrong with the websocket");
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
      <ChatList
        messages={chatMessages}
      />
    </div>
  );
}

export default ChatApp;