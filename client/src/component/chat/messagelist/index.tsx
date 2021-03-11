import { Box } from '@chakra-ui/react';
import * as React from 'react';
import { LeftMessage, RightMessage } from './message';
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
            <LeftMessage
              key={i}
              timestamp={msg.timestamp}
              personName={msg.name}
              avatar={msg.avatar}
              marginBottom={
                isFirst(i) ? "2.5px" :
                marginManager(messages[i-1].userId, msg.userId)
              }
            >
              {msg.message}
            </LeftMessage>
          );
        }
        // this is the right side
        return(
          <RightMessage 
            key={i}
            timestamp={msg.timestamp}
            marginBottom={
              isFirst(i) ? "2.5px" :
              marginManager(messages[i-1].userId, msg.userId)
            }
          >
            {msg.message}
          </RightMessage>
        );
      })}
    </Box>
  );
}

function isFirst(index: number): boolean{
  return index === 0 ? true : false;
}

function marginManager (previousId: number, currentId: number): string{
  return previousId === currentId ? "1px" : "2.5px";
}