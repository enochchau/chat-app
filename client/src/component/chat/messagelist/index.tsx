import { Box } from '@chakra-ui/react';
import * as React from 'react';
import { Message } from './message';
import { HTMLWsMsg } from '../wsmsg';


interface MessageListProps{
  messages: Array<HTMLWsMsg>;
  currentUserId: number;
}
export const MessageList = ({messages, currentUserId}: MessageListProps) => {
  return(
    <Box>
      {messages.map((msg, i) => {
        // this is the left side
        if(msg.userId !== currentUserId){
          return(
            <Message
              key={i}
              timestamp={msg.timestamp}
              personName={msg.name}
              avatarSrc={msg.avatar}
              variant="left"
            >
              {msg.message}
            </Message>
          );
        }
        // this is the right side
        return(
          <Message
            key={i}
            timestamp={msg.timestamp}
            personName={msg.name}
            avatarSrc={msg.avatar}
            variant="right"
          >
            {msg.message}
          </Message>
        );
      })}
    </Box>
  );
}