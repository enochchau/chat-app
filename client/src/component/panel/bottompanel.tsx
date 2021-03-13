import * as React from 'react';
import { ChatInput } from '../chat/chatinput'
import { Flex, Box } from '@chakra-ui/react';
import { ClickOutside } from '../clickoutside';
import { Picker } from '../chat/emojipicker';
import { SmileIcon } from '../icon';
import { EmojiData } from 'emoji-mart';

interface BottomPanelProps {
  rightPanelStatus: boolean;
  onMessageSubmit: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  clickEmoji: (emoji: EmojiData, e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}
export const BottomPanel = ({rightPanelStatus, onMessageSubmit, clickEmoji}: BottomPanelProps) => {
  const [toggleEmojiPicker, setToggleEmojiPicker] = React.useState<boolean>(false);
  const showEmojiPicker = () => {
    setToggleEmojiPicker(!toggleEmojiPicker) ;
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
          onKeyPress={onMessageSubmit}
          onInput={HANDLE INPUT HERE, LINK TO EMOJI PICKER}
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