import * as React from 'react';
import { Box, ChakraProps, useStyleConfig } from "@chakra-ui/react" ;
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

  const parentStyles = useStyleConfig("ChatInput", {});

  const childStyles = useStyleConfig("ChatInputChild", {variant: (showPlaceholder ? 'showPlaceholder' : 'noPlaceholder')});

  return(
    <Box
      {...rest}
      sx={parentStyles}
    >
      <Box
        sx={childStyles}
        contentEditable
        onInput={handleInput}
        ref={chatRef}
        onKeyPress={handleKeyPress}
      ></Box>
    </Box>
  );
}


export { ChatInput, processSendMessageEvent, shouldShowPlaceholder }