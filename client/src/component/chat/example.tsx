import { Flex, Box } from '@chakra-ui/react';
import * as React from 'react';
import { ChatInput, processSendMessageEvent, shouldShowPlaceholder } from './chatinput';
import { MessageList } from './messagelist';
import { convertStringToHTMLWsMsg, HTMLWsMsg, StringWsMsg } from './wsmsg';
import { StoreContext } from '../../store';


export const ChatApp = () => {
  const [messages, setMessages] = React.useState<Array<HTMLWsMsg>>([]);
  const [showPlaceholder, setShowPlaceholder] = React.useState<boolean>(true);

  const { storeState, storeDispatch} = React.useContext(StoreContext);

  const handleNewMessage = (newMessage: StringWsMsg) => {
    // messages are recieved as strings but must be displayed as HTML
    const htmlMessage = convertStringToHTMLWsMsg(newMessage);
    const updatedMessages = [...messages];
    updatedMessages.push(htmlMessage);
    setMessages(updatedMessages);
  }

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setShowPlaceholder(shouldShowPlaceholder(e));
  }

  // send message here essentially
  const sendMessage = (e:React.KeyboardEvent<HTMLDivElement>) => {
    const newMessage = processSendMessageEvent(e, storeState.id, storeState.name);
    if(newMessage) {
      handleNewMessage(newMessage);
      // reset the chat box
      e.currentTarget.textContent = "";
      setShowPlaceholder(true);
    }
  }

  return(
    <Box>
      <Box
        overflow="auto"
        maxHeight="calc(100% - 76px)"
      >
        <Box height="100vh">
          <MessageList
            messages={messages}
            currentUserId={storeState.id}
          />
        </Box>
      </Box>

      <ChatInput
        showPlaceholder={showPlaceholder}
        onInput={handleInput}
        onKeyPress={sendMessage}
      />
    </Box>
  );
}