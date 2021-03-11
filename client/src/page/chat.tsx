import * as React from 'react';
import { StoreContext } from '../store';
import { Box, Flex } from '@chakra-ui/react';
import { Link } from '../component/route';

import { SidePanel } from '../component/panel/sidepanel';
import { TopAvatarPanel } from '../component/panel/toppanel';

import { MessageList } from '../component/chat/messagelist';
import { ChatInput, shouldShowPlaceholder, processSendMessageEvent } from '../component/chat/chatinput';

import { StringWsMsg, HTMLWsMsg, convertStringToHTMLWsMsg } from '../component/chat/wsmsg';

// DEMO DATA
const DEMOAVATAR = "https://scontent.fsjc1-3.fna.fbcdn.net/v/t1.0-1/c24.33.198.198a/p240x240/67663361_2399631803645638_9161317739476811776_n.jpg?_nc_cat=105&ccb=1-3&_nc_sid=7206a8&_nc_ohc=cfz9q50SoxoAX8lpemZ&_nc_ht=scontent.fsjc1-3.fna&tp=27&oh=0fccda4857990efe2fd7a8595cd3e12c&oe=606CB318"

const demoMessage:StringWsMsg = {
  message: "some message",
  userId: 3489053908445,
  timestamp: new Date(),
  name: "person name person",
  avatar: DEMOAVATAR,
}

const demoHTMLMessage:HTMLWsMsg = {
  message: <Box>some message"</Box>,
  userId: 3489053908445,
  timestamp: new Date(),
  name: "person name person",
  avatar: DEMOAVATAR,
}

const demoChat:Array<HTMLWsMsg> = [];
for(let i=0; i<0; i++){
  demoChat.push(demoMessage);
}

// the middle box should have flex
export const ChatPage = () => {
  const [toggleInfo, setToggleInfo] = React.useState<boolean>(true);
  const [messages, setMessages] = React.useState<Array<HTMLWsMsg>>([]);
  const [showPlaceholder, setShowPlaceholder] = React.useState<boolean>(true);
  const { storeState, storeDispatch} = React.useContext(StoreContext);

  const handleInfoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setToggleInfo(!toggleInfo);
  }

  const handleNewMessage = (newMessage: StringWsMsg) => {
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
      // reset the chat box
      e.currentTarget.textContent = "";
      setShowPlaceholder(true);
    }
    handleNewMessage(demoMessage)
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