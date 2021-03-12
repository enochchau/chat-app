import * as React from 'react';
import { Box } from "@chakra-ui/react";
import { ChatMessage, ChatPayload } from '../../api/validators/websocket';

export const parseStringToHtml = (str: string): React.ReactNode => {
  str = str.trim();
  const strArr = str.split('');
  return(
    <>
      {
        strArr.map((character, i) => {
          // add an extra space to replace the newline char
          if (character === '\n') return (<> <br/></>)
          return character
        })
      }
    </>
  );
}