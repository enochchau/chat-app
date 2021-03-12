import * as React from 'react';
import { StoreContext } from '../store';
import { Box, Flex } from '@chakra-ui/react';
import { Link } from '../component/route';

import { SidePanel } from '../component/panel/sidepanel';
import { TopAvatarPanel } from '../component/panel/toppanel';

import { MessageList } from '../component/chat/messagelist';
import { ChatInput, shouldShowPlaceholder, processSendMessageEvent } from '../component/chat/chatinput';

import { convertStringToHTMLWsMsg, HTMLChatMessage } from '../component/chat/wsmsg';
import { rxFriendMessage, rxGroupMessage } from '../api/demodata';
import { ChatMessage, ServerMessage } from '../api/validators/websocket';

// the middle box should have flex
export const ChatPage = () => {
  const [toggleInfo, setToggleInfo] = React.useState<boolean>(true);
  const [messages, setMessages] = React.useState<Array<HTMLChatMessage>>([]);
  const [showPlaceholder, setShowPlaceholder] = React.useState<boolean>(true);
  const { storeState, storeDispatch} = React.useContext(StoreContext);

  const handleInfoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setToggleInfo(!toggleInfo);
  }

  const handleNewMessage = (newMessage: ChatMessage) => {
    // messages are recieved as strings but must be displayed as HTML
    const htmlMessage = convertStringToHTMLWsMsg(newMessage);
    const updatedMessages = [...messages];
    updatedMessages.push(htmlMessage);
    setMessages(updatedMessages);
  }

  const handleChatInput = (e: React.FormEvent<HTMLDivElement>) => {
    setShowPlaceholder(shouldShowPlaceholder(e));
  }

  // send message here essentially
  const handleSendMessage = (e:React.KeyboardEvent<HTMLDivElement>) => {
    const newMessage = processSendMessageEvent(e, storeState.id, storeState.name);
    if(newMessage) {
      handleNewMessage(newMessage);
      setTimeout(() => {handleNewMessage(rxFriendMessage)}, 500);

      // reset the chat box
      e.currentTarget.textContent = "";
      setShowPlaceholder(true);
    }
  }

  return(
    <Flex
      maxHeight="100vh"
      maxWidth="100vw"
      // overflowX="hidden"
      // overflowY="hidden"
      direction="row"
      wrap="nowrap"
      justify="space-between"
      align="flex-start"
    >
      <Box>
        <SidePanel width={{sm: '84px', md:"360px"}} border="1px">
          <Box height="1300px">
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/chat">Chat</Link>
          </Box>
        </SidePanel>
      </Box>

      <Box
        width="100%"
        height="100%"
      >
        <TopAvatarPanel name="Enoch" onInfoClick={handleInfoClick}/>
        <Box
          height="70vh"
          overflowY="auto"
        >
          <MessageList
            messages={messages}
            currentUserId={storeState.id}
          />
        </Box>
        <Box
          width={{
            sm: toggleInfo ? "calc(100vw - 84px - 249px)" : "calc(100vw - 84px)",
            md: toggleInfo ? "calc(100vw - 360px - 249px)" : "calc(100vw - 360px)",
          }}
        >
          <ChatInput
            showPlaceholder={showPlaceholder}
            onInput={handleChatInput}
            onKeyPress={handleSendMessage}
            toggleInfo={toggleInfo}
          />
        </Box>
      </Box>

      { toggleInfo && 
        <Box width="249px">
          <SidePanel width="249px" border="1px">
            <Box height="1300px"></Box>
          </SidePanel>
        </Box>
      }

    </Flex>
  );
}