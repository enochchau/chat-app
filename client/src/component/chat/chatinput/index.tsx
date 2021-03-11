import * as React from 'react';
import { Box } from "@chakra-ui/react" ;
import { processSendMessageEvent } from './sendmessage';
import {shouldShowPlaceholder} from './placeholder'

interface ChatInputProps {
  onInput: (e: React.FormEvent<HTMLDivElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  showPlaceholder: boolean;
}

const ChatInput = ({onInput, onKeyPress, showPlaceholder}: ChatInputProps) => {
  return(
    <Box
      borderRadius='xl'
      margin="10px"
      backgroundColor="gray"
    >
      <Box 
        overflowY="auto" 
        overflowX="hidden" 
        maxHeight="100px"
        paddingLeft="10px"
        paddingRight="10px"
      >
        <Box
          padding="5px"
          contentEditable
          border="none"
          _focus={{outline: "none"}}
          fontSize="md"          
          onInput={onInput}
          overflowWrap="break-word"
          onKeyPress={onKeyPress}
          _after={showPlaceholder 
            ? {
              content: '"Aa"', 
              color: "gray.600",
            } 
            : {}}
        />
      </Box>
    </Box>
  );
}

export { ChatInput, processSendMessageEvent, shouldShowPlaceholder }