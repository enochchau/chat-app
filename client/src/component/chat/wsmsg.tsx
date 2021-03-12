import * as React from 'react';
import { Box } from "@chakra-ui/react";
import { ChatMessage, ChatPayload } from '../../api/validators/websocket';

export type HTMLPayload = Omit<ChatPayload, "message"> & {message: React.ReactNode}
export type HTMLChatMessage = Pick<ChatMessage, "topic"> & {payload: HTMLPayload}

const parseStringToHtml = (str: string): React.ReactNode => {
  const strArr = str.split('');
  return(
    <Box>
      {
        strArr.map((character, i) => {
          // add an extra space to replace the newline char
          if (character === '\n') return (<> <br/></>)
          return character
        })
      }
    </Box>
  );
}

export function convertStringToHTMLWsMsg(message: ChatMessage): HTMLChatMessage {
  const html = parseStringToHtml(message.payload.message.trim());

  const htmlMessage: HTMLChatMessage = {
    topic: message.topic,
    payload: {
      message: html,
      chatId: message.payload.chatId,
      timestamp: message.payload.timestamp
    }
  }
  return htmlMessage
}