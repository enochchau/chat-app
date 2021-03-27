import { Flex } from '@chakra-ui/react';
import * as React from 'react';
import { Message } from './message';

export type DisplayableMessage = {
  messageId: number,
  userId: number,
  name: string,
  message: React.ReactFragment,
  timestamp: Date,
  avatarSrc?: string,
  removed: boolean,
}

interface MessageListProps{
  messages: Array<DisplayableMessage>;
  userCount: number;
  currentUserId: number;
  onRemoveClick: (_e: React.MouseEvent<HTMLButtonElement>, _id: number) => void;
}
export const MessageList: React.FC<MessageListProps> = ({messages, currentUserId, userCount, onRemoveClick}) => {
  // only show avatar if the next message userid != current message userid
  // only show name if user count > 2 and last message userid != current message userid

  const determineSize = (current: DisplayableMessage, messages: DisplayableMessage[], index: number, direction: 'Right' | 'Left', removed: boolean):string | undefined => {
    if(removed) return undefined;
    if(messages.length >= 2){
      if(index === 0 && messages[index + 1].userId === current.userId) return `bottom${direction}`;
      if(index === 0 && messages[index + 1].userId !== current.userId) return undefined;
      if(index === messages.length - 1 && messages[index - 1].userId === current.userId) return `top${direction}`;
      if(index === messages.length - 1 && messages[index - 1].userId !== current.userId) return undefined; 
      // any subsequent cases will have messages.length > 2
      if(current.userId !== messages[index-1].userId && current.userId !== messages[index+1].userId) return undefined;
      if(current.userId !== messages[index-1].userId) return `bottom${direction}`;
      if(current.userId !== messages[index+1].userId) return `top${direction}`;
      return `middle${direction}`;
    }
    return undefined;
  }

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
              variant={msg.removed ? "removedLeft" : "left"}
              showAvatar={
                i === 0 ? true : msg.userId !== messages[i-1].userId 
              }
              showName={userCount > 2 && (i === messages.length - 1 ? true :  msg.userId !== messages[i+1].userId)}
              onRemoveClick={onRemoveClick}
              messageId={msg.messageId}
              size={determineSize(msg, messages, i, 'Left', msg.removed)}
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
            variant={msg.removed ? "removedRight" : "right"}
            messageId={msg.messageId}
            onRemoveClick={onRemoveClick}
            size={determineSize(msg, messages, i, 'Right', msg.removed)}
          >
            {msg.message}
          </Message>
        );
      })}
    </Flex>
  );
}