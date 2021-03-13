import * as React from 'react';
import { ChatInput } from '../chat/chatinput'
import { Flex, Box } from '@chakra-ui/react';
import { ClickOutside } from '../clickoutside';
import { Picker } from '../chat/emojipicker';
import { SmileIcon } from '../icon';
import { BaseEmoji } from 'emoji-mart';

interface BottomPanelProps {
  rightPanelStatus: boolean;
  onMessageSubmit: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}
export const BottomPanel = ({rightPanelStatus, onMessageSubmit}: BottomPanelProps) => {
  const [toggleEmojiPicker, setToggleEmojiPicker] = React.useState<boolean>(false);
  const chatText = React.createRef<HTMLDivElement>();
  const showEmojiPicker = () => {
    setToggleEmojiPicker(!toggleEmojiPicker) ;
  }

  const clickEmoji = (emoji: BaseEmoji, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if(chatText.current){
      chatText.current.innerText += emoji.native;
    }
  }
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if(chatText.current){
      console.log(chatText.current.innerHTML)
    }
  }
  const hideEmojiPicker = () => {
    setToggleEmojiPicker(false);
  }
  return(
    <Flex
      flexDir="row"
      padding="10px"
    >
      <Box 
        width={
          rightPanelStatus
          ? {
            sm:"calc(100vw - 458px)", // these are calculated based on the right and left panel
            md:"calc(100vw - 734px)"
          }
          : {
            sm:"calc(100vw - 153px)",
            md:"calc(100vw - 429px)"
          }
        }
      > 
        <ChatInput
          onEnterPress={onMessageSubmit}
          onInput={handleInput}
          chatRef={chatText}
          borderTopLeftRadius="xl"
          borderBottomLeftRadius="xl"
          backgroundColor="gray.100"
        />
      </Box>
      <Box
        backgroundColor="gray.100"
        borderTopRightRadius="xl"
        borderBottomRightRadius="xl"
      >
        <ClickOutside onClick={hideEmojiPicker}>
          <SmileIcon
            mt="10px"
            mr="10px"
            onClick={showEmojiPicker}
          />
          {toggleEmojiPicker && 
            <Picker
              toggleOffset={rightPanelStatus}
              onClick={clickEmoji}
            />
          }
        </ClickOutside>
      </Box>
    </Flex>
  );
}