import * as React from 'react';
import { HStack, Box, Flex } from "@chakra-ui/react" ;
import { processSendMessageEvent } from './sendmessage';
import {shouldShowPlaceholder} from './placeholder'
import { SmileIcon } from '../../icon';

interface ChatInputProps {
  onInput: (e: React.FormEvent<HTMLDivElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  showPlaceholder: boolean;
  toggleInfo: boolean;
}

const ChatInput = ({onInput, onKeyPress, toggleInfo, showPlaceholder}: ChatInputProps) => {
  return(
    <Box
      borderRadius='xl'
      margin="10px"
      backgroundColor="gray.100"
      maxWidth="inherit"
    >
      <Box 
        overflowY="auto" 
        overflowX="hidden" 
        maxHeight="100px"
        maxWidth="inherit"
        paddingLeft="10px"
        paddingRight="10px"
      >
        <Box
          overflowWrap="break-word"
          textOverflow="clip"
          padding="5px"
          contentEditable
          border="none"
          _focus={{outline: "none"}}
          fontSize="md"          
          onInput={onInput}
          onKeyPress={onKeyPress}
          _after={showPlaceholder 
            ? {
              content: '"Aa"', 
              color: "gray.400",
            } 
            : {}}
        />
      </Box>
    </Box>
  );
}

export { ChatInput, processSendMessageEvent, shouldShowPlaceholder }