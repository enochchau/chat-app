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
  userCount: number;
  currentUserId: number;
}
export const MessageList: React.FC<MessageListProps> = ({messages, currentUserId, userCount}) => {
  // only show avatar if the next message userid != current message userid
  // only show name if user count > 2 and last message userid != current message userid
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
                i === 0 ? true : msg.userId !== messages[i-1].userId 
              }
              showName={userCount > 2 && (i === messages.length - 1 ? true :  msg.userId !== messages[i+1].userId)}
              size={
                (i === 0) ? 'bottomLeft': 
                  (i === messages.length - 1) ? 'topLeft': 
                    (msg.userId !== messages[i-1].userId && msg.userId !== messages[i+1].userId)  ? undefined : 
                      msg.userId !== messages[i-1].userId ? "bottomLeft" :
                        msg.userId !== messages[i+1].userId ? "topLeft" :
                          "middleLeft" 
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
            size={
              (i === 0) ? 'bottomRight': 
                (i === messages.length - 1) ? 'topRight': 
                  (msg.userId !== messages[i-1].userId && msg.userId !== messages[i+1].userId)  ? undefined : 
                    msg.userId !== messages[i-1].userId ? "bottomRight" :
                      msg.userId !== messages[i+1].userId ? "topRight" :
                        "middleRight" 
            }
          >
            {msg.message}
          </Message>
        );
      })}
    </Flex>
  );
}