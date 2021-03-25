import * as React from 'react';
import { ChatInput } from '../../../component/chat/chatinput'
import { Flex, Box, useStyleConfig, IconButton } from '@chakra-ui/react';
import { ClickOutside } from '../../../component/clickoutside';
import { Picker } from '../../../component/chat/emojipicker';
import { SmileIcon } from '../../../component/icon';
import { BaseEmoji } from 'emoji-mart';
import { Icon } from 'theme';

interface BottomPanelProps {
  rightPanelStatus: boolean;
  onMessageSubmit: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}
export const BottomPanel = ({rightPanelStatus, onMessageSubmit}: BottomPanelProps) => {
  const [toggleEmojiPicker, setToggleEmojiPicker] = React.useState<boolean>(false);
  const [updatePlaceholder, setUpdatePlaceholder] = React.useState<boolean>(false);

  const chatRef = React.createRef<HTMLDivElement>();

  const iconStyle = useStyleConfig("Icon", {variant: 'emojiPicker'});

  const showEmojiPicker = () => {
    setToggleEmojiPicker(!toggleEmojiPicker) ;
  }

  const clickEmoji = (emoji: BaseEmoji, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if(chatRef.current){
      chatRef.current.innerText += emoji.native;
      setUpdatePlaceholder(!updatePlaceholder);
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
            ? 
            {
              sm:"calc(100vw - 458px)", // these are calculated based on the right and left panel
              md:"calc(100vw - 734px)"
            }
            : 
            {
              sm:"calc(100vw - 153px)",
              md:"calc(100vw - 429px)"
            }
        }
      > 
        <ChatInput
          onEnterPress={onMessageSubmit}
          chatRef={chatRef}
          updatePlaceholder={updatePlaceholder}
          borderTopLeftRadius="2xl"
          borderBottomLeftRadius="2xl"
          backgroundColor="gray.100"
        />
      </Box>
      <Box
        backgroundColor="gray.100"
        borderTopRightRadius="2xl"
        borderBottomRightRadius="2xl"
      >
        <ClickOutside onClick={hideEmojiPicker}>
          <IconButton
            isRound
            sx={iconStyle}
            aria-label='emoji picker'
            size="sm"
            icon={<SmileIcon
              onClick={showEmojiPicker}
              fontSize="16px"
            />}
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