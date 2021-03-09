import * as React from 'react';
import { ChatMessage } from './chatmsg';

interface ChatListProps {
  messages: Array<ChatMessage>
}

const ChatList = ({messages}:ChatListProps) => {
  return(
    <div>
      {messages.map((msg, i) => {
        return(
          <div key={i}>
            <p>{`${msg.timestamp} ${msg.username}: ${msg.message}`}</p>
          </div>
        );
      })}
    </div>
  );
}

export default ChatList;