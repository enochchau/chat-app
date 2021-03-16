import * as React from 'react';
// store
import { StoreContext } from '../../store';
// validators
import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/Either';
import * as t from 'io-ts';
// chakra
import { Box, Flex } from '@chakra-ui/react';
// page panel
import { SidePanel } from '../../component/panel/sidepanel';
import { TopAvatarPanel } from './toppanel';
import { MessageList } from '../../component/chat/messagelist';
import { BottomPanel } from './bottompanel';
import { LeftPanel } from './leftpanel';
// processing functions
import { processSendMessageEvent } from '../../component/chat/chatinput';
import  { parseStringToHtml } from '../../component/chat/htmlchatmessage';
// websocket message interfaces
import { RxChatMessage, ServerMessage } from '../../api/validators/websocket';
import { DisplayableMessage } from '../../component/chat/messagelist/index';
// api
import { WSURL, axiosAuth } from '../../api/api';
import { AuthMessage } from '../../api/validators/websocket';
// router
import { useParams } from 'react-router';
import { getToken } from 'api/token';


type ConnectedUserTracker = Map<number, ConnectedUser>
type ConnectedUser = {
  name: string,
  avatar?: string,
};

// When a user connects to a room
function createDisplayableMessage(userId: number, connectedUser: ConnectedUser, htmlMessage: React.ReactNode, message: RxChatMessage){
  return {
    userId: userId,
    name: connectedUser.name,
    avatarSrc: connectedUser.avatar,
    timestamp: message.payload.timestamp,
    message: htmlMessage,
  } as DisplayableMessage
}

interface Params{
  groupId?: string
}

// LEFT PANEL
// a list of potential groups that a user can join.

// CENTRAL CHAT APP
// 1. the user clicks on the side bar to pick a group
// 2. they are redirected to the central chat component
// 3. a GET request is sent to retrieve the group's meta data (names, avatars, etc.)
// 4. The websocket is authenticated
// 5. the user can begin chatting

// RIGHT PANEL
// shows meta data on the current group

// the middle box should have flex
export const ChatPage = () => {
  const { storeState, storeDispatch} = React.useContext(StoreContext);
  // messages to be displayed
  const [messages, setMessages] = React.useState<Array<DisplayableMessage>>([]);

  // websocket
  const ws = React.useRef<WebSocket | null>(null);

  // the groupId the user is requesting
  const { groupId } = useParams<Params>(); 
  // this map should be populated when the user enters a new chat room
  // use the REST API
  const [connectedUsers, setConnectedUsers] = React.useState<ConnectedUserTracker>(new Map());

  const [toggleInfo, setToggleInfo] = React.useState<boolean>(true);
  const handleInfoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setToggleInfo(!toggleInfo);
  }

  // WEBSOCKET stuff happens here
  React.useEffect(() => {
    function disconnect(){
      if(ws.current !== null) ws.current.close();
    }

    ws.current = new WebSocket(WSURL);

    if(!groupId) {
      console.log('No groupId url parameter detected. Unable to open websocket.');
      return disconnect();
    }
    const authGroupId = parseInt(groupId);

    const token = getToken();
    if(!token) {
      console.log('No token found. Unable to open websocket.');
      return disconnect();
    }

    // setup the message handler
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      const onBadMessage = (errors: t.Errors) => {
        console.log('Server message validation error: ', errors);
        // all message validation failed.
        console.log("Unable to validate recieved message at websocket.");
      }
      const handleServerMessage = (message: ServerMessage) => {
        console.log('Server Message: ', message)
      }

      // if ChatMessage decode fails, pipe into ServerMessage
      const tryServerMessage = (errors: t.Errors) => {
        console.log('Chat message validation error: ', errors);
        pipe(ServerMessage.decode(message), fold(onBadMessage, handleServerMessage));
      }

      const handleNewMessage = (message: RxChatMessage) => {
        const insertIntoMessageList = (sender: ConnectedUser) => {
          const displayableMessage = createDisplayableMessage(message.payload.userId, sender, html, message);
          const updatedMessages = [...messages];
          // array is displayed backwards, later messages should come first
          updatedMessages.unshift(displayableMessage);
          setMessages(updatedMessages);
        }

        console.log("Chat Message: ", message);
        // messages are recieved as strings but must be displayed as HTML
        const html = parseStringToHtml(message.payload.message);
        const sender = connectedUsers.get(message.payload.userId);

        if(sender){
          insertIntoMessageList(sender);
        } else {
          // do a fetch request to get the data since we've evidently lost it
        }
      }
      // start here!
      pipe(RxChatMessage.decode(message), fold(tryServerMessage, handleNewMessage));
    }

    // get group meta data
    // todo
    axiosAuth.get('/api/group', {
      params: {
        count: 15,
        date: new Date(),
      }
    })

    // send the first message to get authenticated
    const authMessage: AuthMessage = {
      topic: "auth",
      payload: {
        timestamp: new Date(),
        groupId: authGroupId,
        token: token,
      }
    }
    ws.current.send(JSON.stringify(authMessage));

    // disconnect from WS on unmount
    return disconnect();
  }, []);

  // send message here essentially
  const handleSendMessage = (e:React.KeyboardEvent<HTMLDivElement>) => {
    // hardcoded Demo data should be replaced later
    const newMessage = processSendMessageEvent(e, "chat", storeState.id, 33);
    if(newMessage && ws.current) {
      ws.current.send(JSON.stringify(newMessage));
    }
    // reset the chat box
    e.currentTarget.textContent = "";
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
        <LeftPanel
          username={storeState.name}
          avatarSrc={storeState.avatar}
          moreOptionsClick={(e) => {return}}
          newGroupClick={(e) => {return}}
          groupData={new Array()}
        />
      </Box>

      <Flex 
        width="100%"
        flexDir="column"
        justify="space-between"
        height="100vh"
      >
        <Box>
          <TopAvatarPanel username={storeState.name} onInfoClick={handleInfoClick}/>
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
