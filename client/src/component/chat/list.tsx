import { Flex, Stack, Box } from '@chakra-ui/react';
import * as React from 'react';
import { LeftMessage, RightMessage } from './message';

export interface WsMsg {
  message: string,
  userId: number,
  timestamp: Date,
}
interface MessageListProps{
  messages: Array<WsMsg>;
  currentUserId: number;
}
export const MessageList = ({messages, currentUserId}: MessageListProps) => {
  return(
    <Stack>
      {messages.map((msg, i) => {
        // this is the left side
        if(msg.userId !== currentUserId){
          return(
            <LeftMessage
              timestamp={msg.timestamp}
            >
              {msg.message}
            </LeftMessage>
          );
        }
        // this is the right side
        return(
          <RightMessage 
            timestamp={msg.timestamp}
          >
            {msg.message}
          </RightMessage>
        );
      })}
    </Stack>
  );
}