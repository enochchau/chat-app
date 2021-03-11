import * as React from 'react';
import { Box } from "@chakra-ui/react";

interface WsMsg {
  userId: number;
  timestamp: Date;
  name: string;
  avatar?: string;
}
export interface StringWsMsg extends WsMsg{
  message: string;
}
export interface HTMLWsMsg extends WsMsg{
  message: React.ReactNode;
}

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

export function convertStringToHTMLWsMsg(message: StringWsMsg): HTMLWsMsg {
  const html = parseStringToHtml(message.message.trim());

  const htmlMessage: HTMLWsMsg = {
    message: html,
    userId: message.userId,
    timestamp: message.timestamp,
    name: message.name,
    avatar: message.avatar
  }
  return htmlMessage
}