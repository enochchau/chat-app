import * as React from 'react';
import { Picker as EmojiPicker } from 'emoji-mart';
import { chakra, ChakraProps } from '@chakra-ui/react';


const ChakraEmojiPicker = chakra(EmojiPicker);

interface PickerProps {
  toggleOffset: boolean;
}
export const Picker: typeof ChakraEmojiPicker = ({toggleOffset, ...rest}: PickerProps) => 
  <ChakraEmojiPicker
    enableFrequentEmojiSort={true}
    set="facebook"
    perLine={8}
    showSkinTones={false}
    showPreview={false}
      style={{
        fontSize: "12px", 
        color: '#666',
        bottom: "60px", 
        right: toggleOffset ? "265px" : "30px", 
        position: "absolute",
        boxShadow: "2px 2px 8px 1px rgba(0, 0, 0, 0.2)",
        overflow: "hidden"
      }}
    {...rest}
  />