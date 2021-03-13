import * as React from 'react';
import { StoreContext } from '../store';
import { Box, Flex } from '@chakra-ui/react';
import { Link } from '../component/route';

import { SidePanel } from '../component/panel/sidepanel';
import { TopAvatarPanel } from '../component/panel/toppanel';

import { MessageList } from '../component/chat/messagelist';
import { ChatInput, shouldShowPlaceholder, processSendMessageEvent } from '../component/chat/chatinput';

import  { parseStringToHtml } from '../component/chat/htmlchatmessage';
import { rxFriendMessage, rxGroupMessage, demoDisplayMessage } from '../api/demodata';
import { ChatMessage, ServerMessage } from '../api/validators/websocket';
import { DisplayableMessage } from '../component/chat/messagelist/index';

import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/Either';
import * as t from 'io-ts';
import { SmileIcon } from '../component/icon';
import { Picker } from '../component/chat/emojipicker';

import { ClickOutside } from '../component/clickoutside';

type ConnectedUserTracker = Map<number, ConnectedUser>
const demoNameTracker = new Map();
demoNameTracker.set(-1,{name:"Demo User"});
demoNameTracker.set(2, {name:"Demo Friend"});

type ConnectedUser = {
  name: string,
  avatar?: string,
};


function createDisplayableMessage(userId: number, connectedUser: ConnectedUser, htmlMessage: React.ReactNode, message: ChatMessage){
  return {
    userId: userId,
    name: connectedUser.name,
    avatarSrc: connectedUser.avatar,
    timestamp: message.payload.timestamp,
    message: htmlMessage,
  } as DisplayableMessage
}
// <Picker
// />

// the middle box should have flex
export const ChatPage = () => {
  const [toggleInfo, setToggleInfo] = React.useState<boolean>(true);
  const [messages, setMessages] = React.useState<Array<DisplayableMessage>>([demoDisplayMessage, demoDisplayMessage, demoDisplayMessage]);
  const [toggleEmojiPicker, setToggleEmojiPicker] = React.useState<boolean>(false);

  // this map should be populated when the user enters a new chat room
  // use the REST API
  const [connectedUsers, setConnectedUsers] = React.useState<ConnectedUserTracker>(demoNameTracker || new Map());

  const { storeState, storeDispatch} = React.useContext(StoreContext);

  const handleInfoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setToggleInfo(!toggleInfo);
  }

  const showEmojiPicker = () => {
    setToggleEmojiPicker(!toggleEmojiPicker) ;
  }
  const hideEmojiPicker = () => {
    setToggleEmojiPicker(false);
  }

  const handleNewMessage = (newMessage: any) => {

    const onLeft = (errors: t.Errors) => console.error("Bad rx at websocket", errors);
    const onRight = (newMessage: ChatMessage) => {
      // messages are recieved as strings but must be displayed as HTML
      const html = parseStringToHtml(newMessage.payload.message);

      const sender = connectedUsers.get(newMessage.payload.userId);
      if(sender){
        const displayableMessage = createDisplayableMessage(newMessage.payload.userId, sender, html, newMessage);
        const updatedMessages = [...messages];
        updatedMessages.push(displayableMessage);
        setMessages(updatedMessages);
      } else {
        // do a fetch request to get the data since we've evidently lost it
      }
    }
    // check the message here
    pipe(ChatMessage.decode(newMessage), fold(onLeft, onRight));
  }

  // send message here essentially
  const handleSendMessage = (e:React.KeyboardEvent<HTMLDivElement>) => {
    // hardcoded Demo data should be replaced later
    const newMessage = processSendMessageEvent(e, "chat friend", storeState.id, 33);
    if(newMessage) {
      handleNewMessage(newMessage);
      setTimeout(() => {handleNewMessage(rxFriendMessage)}, 500);

      // reset the chat box
      e.currentTarget.textContent = "";
    }
  }

  return(
    <Flex
      height="100vh"
      width="100vw"
      // overflowX="hidden"
      // overflowY="hidden"
      direction="row"
      wrap="nowrap"
      justify="space-between"
      align="flex-start"
    >

      <Box>
        <SidePanel width={{sm: '84px', md:"360px"}} boxShadow="base">
          <Box height="1300px">
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/chat">Chat</Link>
          </Box>
        </SidePanel>
      </Box>

      <Flex 
        width="100%"
        flexDir="column"
        justify="space-between"
        height="100vh"
      >
        <Box>
          <TopAvatarPanel name="Enoch" onInfoClick={handleInfoClick}/>
        </Box>
        <Box
          overflowY="auto"
          padding="5px"
          flexBasis="calc( 100vh - 54px - 70px )" // 54=bottom, 74=top 
        >
          <MessageList
            messages={messages}
            currentUserId={storeState.id}
          />
        </Box>
        <Flex
          flexDir="row"
          padding="10px"
        >
          <Box 
            width={
              toggleInfo 
              ? {
                sm:"calc(100vw - 458px)",
                md:"calc(100vw - 734px)"
              }
              : {
                sm:"calc(100vw - 153px)",
                md:"calc(100vw - 429px)"
              }
            }
          > 
            <ChatInput
              onKeyPress={handleSendMessage}
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
                  toggleOffset={toggleInfo}
                />
              }
            </ClickOutside>
          </Box>
        </Flex>

      </Flex>

      { toggleInfo && 
        <Box>
          <SidePanel width="320px" boxShadow="base">
            <Box height="1300px"></Box>
          </SidePanel>
        </Box>
      }

    </Flex>
  );
}
