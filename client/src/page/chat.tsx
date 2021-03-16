import * as React from 'react';
import { StoreContext } from '../store';
import { Box, Flex } from '@chakra-ui/react';
import { Link } from '../component/route';

import { SidePanel } from '../component/panel/sidepanel';
import { TopAvatarPanel } from '../component/panel/toppanel';

import { MessageList } from '../component/chat/messagelist';
import { processSendMessageEvent } from '../component/chat/chatinput';
import  { parseStringToHtml } from '../component/chat/htmlchatmessage';

import { RxChatMessage } from '../api/validators/websocket';
import { RxDemoMessage, DisplayDemoMessage } from '../api/demodata';
import { DisplayableMessage } from '../component/chat/messagelist/index';

import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/Either';
import * as t from 'io-ts';

import { WSURL } from '../api/api';
import { BottomPanel } from '../component/panel/bottompanel';

// demo data
type ConnectedUserTracker = Map<number, ConnectedUser>
const demoNameTracker = new Map();
demoNameTracker.set(-1,{name:"Demo User"});
demoNameTracker.set(2, {name:"Demo Friend"});

type ConnectedUser = {
  name: string,
  avatar?: string,
};


function createDisplayableMessage(userId: number, connectedUser: ConnectedUser, htmlMessage: React.ReactNode, message: RxChatMessage){
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
  const [messages, setMessages] = React.useState<Array<DisplayableMessage>>([DisplayDemoMessage, DisplayDemoMessage, DisplayDemoMessage]);
  const ws = React.useRef<WebSocket | null>(null);

  // this map should be populated when the user enters a new chat room
  // use the REST API
  const [connectedUsers, setConnectedUsers] = React.useState<ConnectedUserTracker>(demoNameTracker || new Map());

  const { storeState, storeDispatch} = React.useContext(StoreContext);

  const handleInfoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setToggleInfo(!toggleInfo);
  }

  const handleNewMessage = (newMessage: RxChatMessage) => {

    const onLeft = (errors: t.Errors) => console.error("Bad rx at websocket", errors);
    const onRight = (newMessage: RxChatMessage) => {
      // messages are recieved as strings but must be displayed as HTML
      const html = parseStringToHtml(newMessage.payload.message);

      const sender = connectedUsers.get(newMessage.payload.userId);
      if(sender){
        const displayableMessage = createDisplayableMessage(newMessage.payload.userId, sender, html, newMessage);
        const updatedMessages = [...messages];
        // array is displayed backwards, later messages should come first
        updatedMessages.unshift(displayableMessage);
        setMessages(updatedMessages);
      } else {
        // do a fetch request to get the data since we've evidently lost it
      }
    }
    // check the message here
    pipe(RxChatMessage.decode(newMessage), fold(onLeft, onRight));
  }

  React.useEffect(() => {
    ws.current = new WebSocket(WSURL);
    return function unmount(){
      if(ws.current !== null){
        ws.current.close();
      }
    }
  }, [])

  // send message here essentially
  const handleSendMessage = (e:React.KeyboardEvent<HTMLDivElement>) => {
    // hardcoded Demo data should be replaced later
    const newMessage = processSendMessageEvent(e, "chat", storeState.id, 33);
    if(newMessage) {

      const mockMessage: RxChatMessage = {
        topic: newMessage.topic,
        payload: {
          timestamp: newMessage.payload.timestamp,
          groupId: newMessage.payload.groupId,
          userId: newMessage.payload.userId,
          message: newMessage.payload.message,
          id: 234,
          created: new Date(),
          updated: new Date()
        }
      }

      handleNewMessage(mockMessage);
      setTimeout(() => {handleNewMessage(RxDemoMessage)}, 500);

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
        <BottomPanel 
          onMessageSubmit={handleSendMessage} 
          rightPanelStatus={toggleInfo}
        />
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
