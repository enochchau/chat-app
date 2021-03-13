import * as React from 'react';
import { Box, ChakraProps, Flex } from "@chakra-ui/react" ;
import { processSendMessageEvent } from './sendmessage';
import {shouldShowPlaceholder} from './placeholder'
import { SmileIcon } from '../../icon';

interface ChatInputProps extends ChakraProps {
  onKeyPress: (e:React.KeyboardEvent<HTMLDivElement>) => void;
}

const ChatInput = ({onKeyPress, ...rest}: ChatInputProps) => {
  const [showPlaceholder, setShowPlaceholder] = React.useState<boolean>(true);
  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if(event.key === "Enter" && event.shiftKey) event.key = "Enter";

    else if(event.key === "Enter"){
      event.preventDefault();
      onKeyPress(event);
      setShowPlaceholder(true);
    }
  }

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setShowPlaceholder(shouldShowPlaceholder(e));
  }
  return(
    <Box
      {...rest}
      width="100%"
      maxHeight="100px"
      overflowY="auto"
      overflowX='hidden'
    >
      <Box
        ml="10px"
        mr="10px"
        padding="5px"
        overflowWrap="break-word"
        textOverflow="clip"
        contentEditable
        border="none"
        _focus={{outline: "none"}}
        fontSize="md"          
        onInput={handleInput}
        onKeyPress={handleKeyPress}
        _after={showPlaceholder 
          ? {
            content: '"Aa"', 
            color: "gray.400",
          } 
          : {}}
      />
    </Box>
  );
}

export { ChatInput, processSendMessageEvent, shouldShowPlaceholder }