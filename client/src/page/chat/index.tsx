import * as React from 'react';
// store
import { StoreContext } from '../../store';
// validators
import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/Either';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
// chakra
import { Box, Flex } from '@chakra-ui/react';
// page panel
import { SidePanel } from '../../component/panel/sidepanel';
import { TopAvatarPanel } from './toppanel';
import { MessageList } from '../../component/chat/messagelist';
import { BottomPanel } from './bottompanel';
import { GroupPanel } from './grouppanel';
import { InfoPanel } from './infopanel';
// processing functions
import { processSendMessageEvent } from '../../component/chat/chatinput';
import  { parseStringToHtml } from '../../component/chat/htmlchatmessage';
// websocket message interfaces
import { RxChatMessage, ServerMessage } from '../../api/validators/websocket';
import { DisplayableMessage } from '../../component/chat/messagelist/index';
// api
import { WSURL } from '../../api';
import { AuthMessage } from '../../api/validators/websocket';
import { 
} from '../../api';
// router
import { useParams } from 'react-router';
import { getToken } from '../../api/token';
// use debounce for search
import { useDebounce } from '../../util';
import { SearchRequest } from 'api/search';
import { GroupMessageDataArr, UserGroupUnionArr } from 'api/validators/entity';
import { GroupRequest } from 'api/group';
import { UserRequest } from 'api/user';


// users in the current group
// caches the user data after we GET request it
export type GroupUsers = Map<number, GroupUser>
export type GroupUser = {
  name: string,
  avatar?: string,
};

// When a user connects to a room
function createDisplayableMessage(userId: number, groupUser: GroupUser, htmlMessage: React.ReactNode, message: RxChatMessage){
  return {
    userId: userId,
    name: groupUser.name,
    avatarSrc: groupUser.avatar,
    timestamp: message.payload.timestamp,
    message: htmlMessage,
  } as DisplayableMessage
}

interface Params{
  groupId?: string
}

// handle searching
type SEARCHACTIONTYPE = 
  | {type: 'setSearchValue', payload: string}
  | {type: 'setIsSearching', payload: boolean}
  | {type: 'setSearchResults', payload: []}
const searchInitialState = {
  searchValue: "",
  isSearching: false,
  searchResults: [],
}
function searchReducer(state: typeof searchInitialState, action: SEARCHACTIONTYPE){
  switch(action.type){
    case 'setSearchValue':
      return {...state, searchValue: action.payload};
    case 'setIsSearching':
      return {...state, isSearching: action.payload};
    case 'setSearchResults':
      return {...state, searchResults: action.payload};
    defualt: 
      return state;
  }
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
  // websocket
  const ws = React.useRef<WebSocket | null>(null);
  // the groupId the user is requesting
  const { groupId } = useParams<Params>(); 

  const { storeState, storeDispatch} = React.useContext(StoreContext);
  // messages to be displayed
  const [messages, setMessages] = React.useState<Array<DisplayableMessage>>([]);
  // groups to be displayed on the group panel
  const [groups, setGroups] = React.useState<GroupMessageDataArr>([]); 
  // map for caching user data from the current group
  const [groupUsers, setGroupUsers] = React.useState<GroupUsers>(new Map());
  // search value in the group panel search box
  const [searchState, searchDispatch] = React.useReducer(searchReducer, searchInitialState);
  const debouncedSearchValue = useDebounce(searchState.searchValue, 1000);

  // toggle the info panel
  const [toggleInfo, setToggleInfo] = React.useState<boolean>(true);

  // fetch the info of ther users in the current group
  React.useEffect(() => {
    UserRequest.getUsers({})
  }, [groupId])

  // handle searching
  React.useEffect(() => {
    // https://usehooks.com/useDebounce/
    if(debouncedSearchValue) {
      searchDispatch({type: 'setIsSearching', payload: true});

      const onLeft = (errors: t.Errors) => {
        console.error('Error validating search request: ', errors);
        searchDispatch({type: 'setIsSearching', payload: false});
      }

      const onRight = (data: UserGroupUnionArr) => {
        console.log(data);
        searchDispatch({type: 'setIsSearching', payload: false});
      }
      
      const onError = (err: Error) => {
        console.error(err);
        searchDispatch({type: 'setIsSearching', payload: false});
      }

      SearchRequest.getSearchGroupsUsers({
        count: 30, 
        search: debouncedSearchValue
      }, onLeft, onRight, onError);

    } else {
      searchDispatch({type: 'setSearchResults', payload: []});
    }
  }, [debouncedSearchValue]);

  // fetch stuff on mount
  React.useEffect(() => {

    const onLeft = (errors: t.Errors) => {
      console.error('Error validating getting groups for user: ', errors);
    }

    const onRight = (data: GroupMessageDataArr) => {
      setGroups(data);
    }

    const onError = (error: Error) => console.error(error);

    GroupRequest.getGroupsForUser({count: 15, date: new Date()}, onLeft, onRight, onError);
  }, []);

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
        const insertIntoMessageList = (sender: GroupUser) => {
          const displayableMessage = createDisplayableMessage(message.payload.userId, sender, html, message);
          const updatedMessages = [...messages];
          // array is displayed backwards, later messages should come first
          updatedMessages.unshift(displayableMessage);
          setMessages(updatedMessages);
        }

        console.log("Chat Message: ", message);
        // messages are recieved as strings but must be displayed as HTML
        const html = parseStringToHtml(message.payload.message);
        const sender = groupUsers.get(message.payload.userId);

        if(sender){
          insertIntoMessageList(sender);
        } else {
          // do a fetch request to get the data since we've evidently lost it
        }
      }
      // start here!
      pipe(RxChatMessage.decode(message), fold(tryServerMessage, handleNewMessage));
    }

    ws.current.onopen = (event) => {
      // send the first message to get authenticated
      const authMessage: AuthMessage = {
        topic: "auth",
        payload: {
          timestamp: new Date(),
          groupId: authGroupId,
          token: token,
        }
      }
      if(ws.current) ws.current.send(JSON.stringify(authMessage));
    };
    // disconnect from WS on unmount
    return disconnect();
  }, [groupId]); // connect to a new chat room everytime we get a new groupid

  // send message here essentially
  const handleSendMessage = (e:React.KeyboardEvent<HTMLDivElement>) => {
    // hardcoded Demo data should be replaced later
    const newMessage = processSendMessageEvent(e, "chat", storeState.id, 33);
    if(newMessage && ws.current) {
      ws.current.send(JSON.stringify(newMessage));
    } else console.error(`Unable to send websocket message\nWeboscket status: ${ws.current}`)
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
        <GroupPanel
          username={storeState.name}
          avatarSrc={storeState.avatar}
          moreOptionsClick={(e) => {return}}
          newGroupClick={(e) => {return}}
          groupData={groups}
          onSearch={(e) => searchDispatch({type: 'setSearchValue', payload: e.currentTarget.value})}
          searchValue={searchState.searchValue}
        />
      </Box>
      <Flex 
        width="100%"
        flexDir="column"
        justify="space-between"
        height="100vh"
      >
        <Box>
          <TopAvatarPanel username={storeState.name} onInfoClick={(e) => setToggleInfo(!toggleInfo)}/>
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
          <InfoPanel/>
        </Box>
      }

    </Flex>
  );
}
