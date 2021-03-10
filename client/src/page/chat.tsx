import * as React from 'react';
import { Box } from '@chakra-ui/react';
import { MessageList, WsMsg } from '../component/chat';

const messages: Array<WsMsg> = [
  {userId: 1, message: "hello world", timestamp: new Date()},
  {userId: 0, message: "hello world", timestamp: new Date()},
  {userId: 1, message: "hello world", timestamp: new Date()},
  {userId: 1, message: "hello world", timestamp: new Date()},
  {userId: 0, message: "hello world", timestamp: new Date()},
  {userId: 0, message: "hello world", timestamp: new Date()},
  {userId: 1, message: "hello world", timestamp: new Date()},
  {userId: 0, message: "hello world", timestamp: new Date()},
  {userId: 1, message: "hello world", timestamp: new Date()},
  {userId: 0, message: "hello world", timestamp: new Date()},
  {userId: 1, message: "hello world", timestamp: new Date()},
  {userId: 0, message: "hello world", timestamp: new Date()},
  {userId: 1, message: "hello world", timestamp: new Date()},
  {userId: 0, message: "hello world", timestamp: new Date()},
  {userId: 0, message: "hello world", timestamp: new Date()},
  {userId: 1, message: "hello world", timestamp: new Date()},
  {userId: 0, message: "hello world", timestamp: new Date()},
];

export const ChatPage = () => {
  return(
    <Box>
      <Box/>
      <MessageList
        currentUserId={0}
        messages={messages}
      />
      <Box/>
    </Box>
  );
}