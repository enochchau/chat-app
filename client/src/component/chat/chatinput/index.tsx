import * as React from 'react';
import { Box, ChakraProps } from "@chakra-ui/react" ;
import { processSendMessageEvent } from './sendmessage';
import {shouldShowPlaceholder} from './placeholder'

interface ChatInputProps extends ChakraProps {
  onEnterPress?: (e:React.KeyboardEvent<HTMLDivElement>) => void;
  onKeyPress?: (e:React.KeyboardEvent<HTMLDivElement>) => void;
  onInput?: (e: React.FormEvent<HTMLDivElement>) => void;
  chatRef: React.RefObject<HTMLDivElement>;
  updatePlaceholder: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({onKeyPress, onEnterPress, onInput, chatRef, updatePlaceholder, ...rest}: ChatInputProps) => {
  const [showPlaceholder, setShowPlaceholder] = React.useState<boolean>(true);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if(event.key === "Enter" && event.shiftKey) event.key = "Enter";

    else if(event.key === "Enter"){
      event.preventDefault();
      if(onEnterPress) onEnterPress(event);
      setShowPlaceholder(true);
    }
    if(onKeyPress) onKeyPress(event);
  }

  const handleInput = (e: React.FormEvent<HTMLDivElement>): void => {
    e.preventDefault();
    if(onInput) onInput(e);

    if(chatRef && chatRef.current){
      setShowPlaceholder(shouldShowPlaceholder(chatRef.current));
    }
  }

  React.useEffect(() => {
    if(chatRef && chatRef.current){
      setShowPlaceholder(shouldShowPlaceholder(chatRef.current));
    }
  }, [ chatRef, updatePlaceholder ]);

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
        onInput={handleInput}
        ref={chatRef}
        border="none"
        _focus={{outline: "none"}}
        fontSize="md"          
        onKeyPress={handleKeyPress}
        _after={showPlaceholder 
          ? {
            content: '"Aa"', 
            color: "gray.400",
          } 
          : {}}
      ></Box>
    </Box>
  );
}

export { ChatInput, processSendMessageEvent, shouldShowPlaceholder }