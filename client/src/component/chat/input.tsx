import * as React from 'react';
import { Box } from "@chakra-ui/react" ;

// see if you can incorporate this into global styles later...
export const FONTSIZE = "1rem";
interface ChatInputProps {
  text: string,
  showPlaceholder: boolean,
  onInput: (e: React.FormEvent<HTMLDivElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}
export const ChatInput = ({text, showPlaceholder, onInput, onKeyPress}: ChatInputProps) => {
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
        width="100%"
        minHeight={FONTSIZE}
        paddingLeft="10px"
        paddingRight="10px"
      >
        <Box
          padding="5px"
          contentEditable
          width="100%"
          height="100%"
          border="none"
          _focus={{outline: "none"}}
          fontSize={FONTSIZE}
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