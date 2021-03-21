import { Flex } from '@chakra-ui/react';
import * as React from 'react';
import { Message } from './message';

export type DisplayableMessage = {
  userId: number,
  name: string,
  message: React.ReactNode,
  timestamp: Date,
  avatarSrc?: string,
}

interface MessageListProps{
  messages: Array<DisplayableMessage>;
  currentUserId: number;
}
export const MessageList = ({messages, currentUserId}: MessageListProps) => {
  return(
    <Flex
      flexDir="column-reverse"
      width="100%"
    >
      {messages.map((msg, i) => {
        // this is the left side
        if(msg.userId !== currentUserId){
          return(
            <Message
              key={i}
              timestamp={msg.timestamp}
              personName={msg.name}
              avatarSrc={msg.avatarSrc}
              variant="left"
              showAvatar={
                i === messages.length-1 ? true : msg.userId !== messages[i+1].userId 
              }
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
            avatarSrc={msg.avatarSrc}
            variant="right"
          >
            {msg.message}
          </Message>
        );
      })}
    </Flex>
  );
}