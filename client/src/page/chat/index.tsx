import * as React from 'react';
// store
import { StoreContext } from '../../store';
// chakra
import { Box, Flex, localStorageManager } from '@chakra-ui/react';
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
// websocket 
import { RxChatMessage, ServerMessage } from '../../api/validators/websocket';
import { WSURL } from '../../api';
import { AuthMessage } from '../../api/validators/websocket';
// websocket -> HTML
import { DisplayableMessage } from '../../component/chat/messagelist/index';
// router
import { Redirect, useParams } from 'react-router';
// token
import { getToken, deleteToken } from '../../api/token';
// use debounce for search
import { useDebounce } from '../../util';
// api / validators
import { UserRequest, SearchRequest, GroupRequest } from '../../api';
import { GroupMessageDataArr, UserData, UserDataArr, GroupData, GroupDataArr, GroupDataWithUsers, GroupMessageData } from '../../api/validators/entity';
import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/Either';
import * as t from 'io-ts';


// When a user connects to a room
function createDisplayableMessage(userId: number, groupUser: UserData, htmlMessage: React.ReactNode, message: RxChatMessage){
  return {
    userId: userId,
    name: groupUser.name,
    avatarSrc: groupUser.avatar,
    timestamp: message.payload.timestamp,
    message: htmlMessage,
  } as DisplayableMessage
}

// handle searching
type SEARCHACTIONTYPE = 
  | {type: 'setSearchValue', payload: string}
  | {type: 'setIsSearching', payload: boolean}
  | {type: 'setSearchResults', payload: GroupDataArr};
const searchInitialState = {
  searchValue: "",
  isSearching: false,
  searchResults: [] as GroupDataArr,
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

// caching current group meta data including users data
export type GroupUsers = Map<number, UserData>
type GROUPACTIONTYPE = {type: 'setGroupData', payload: GroupDataWithUsers};
const groupInitialState ={
  userMap: new Map() as GroupUsers,
  data: {
    id: -1,
    name: 'New Message',
    created: new Date(),
    updated: new Date()
  } as GroupData,
}
function groupReducer(state: typeof groupInitialState, action: GROUPACTIONTYPE){
  switch(action.type){
    case 'setGroupData':
      const userMap = action.payload.users.reduce((map, user) => {
        map.set(user.id, user);
        return map;
      }, new Map() as GroupUsers);

      return{...state, 
        userMap: userMap,
        data: {
          id: action.payload.id,
          name: action.payload.name,
          created: action.payload.created,
          updated: action.payload.updated,
        }
      }
    default:
      return state;
  }
}

// handling user search when creating a new group
type USERSEARCHACTIONTYPE = 
| {type: 'setCreateGroup', payload: boolean}
| {type: 'setSearchString', payload: string}
| {type: 'setUserList', payload: UserDataArr}
| {type: 'setIsSearching', payload: boolean};
const userSearchInitialState = {
  creatingGroup: false,
  searchString: "",
  userList: [] as UserDataArr,
  isSearching: false,
}
function userSearchReducer( state: typeof userSearchInitialState, action: USERSEARCHACTIONTYPE){
  switch(action.type){
    case 'setCreateGroup': 
      return {...state, creatingGroup: action.payload};
    case 'setSearchString':
      return {...state, searchString: action.payload};
    case 'setUserList':
      return {...state, userList: action.payload};
    case 'setIsSearching':
      return {...state, isSearching: action.payload};
    default:
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
  const { groupId } = useParams<{groupId?: string}>(); 
  // global store
  const { storeState, storeDispatch} = React.useContext(StoreContext);
  // messages to be displayed
  const [messages, setMessages] = React.useState<Array<DisplayableMessage>>([]);
  // groups to be displayed on the group panel
  const [groups, setGroups] = React.useState<GroupMessageDataArr>([]); 

  // stores meta data for the current chat group
  const [groupState, groupDispatch] = React.useReducer(groupReducer, groupInitialState);

  // search value in the group panel search box
  const [searchState, searchDispatch] = React.useReducer(searchReducer, searchInitialState);
  const debouncedSearchValue = useDebounce(searchState.searchValue, 500);

  // handle user search when creating new groups
  const [userSearchState, userSearchDispatch] = React.useReducer(userSearchReducer, userSearchInitialState);
  const debouncedUserSearch = useDebounce(userSearchState.searchString, 500);

  // toggle the info panel
  const [toggleInfo, setToggleInfo] = React.useState<boolean>(true);

  // handle searching
  React.useEffect(() => {
    // https://usehooks.com/useDebounce/
    if(debouncedSearchValue) {
      searchDispatch({type: 'setIsSearching', payload: true});

      SearchRequest.getSearchGroups({
        count: 30, 
        search: debouncedSearchValue
      })
        .then(res => res.data)
        .then(data => {
          const onLeft = (errors: t.Errors) => {
            console.error('Error validating search request: ', errors);
          }
          const onRight = (data: GroupDataArr) => {
            searchDispatch({type: 'setSearchResults', payload: data});
            console.log(data);
          }

          pipe(GroupDataArr.decode(data), fold(onLeft, onRight));
          searchDispatch({type: 'setIsSearching', payload: false});
        })
        .catch(error => {
          console.error(error);
          searchDispatch({type: 'setIsSearching', payload: false});
        })

    } else {
      searchDispatch({type: 'setSearchResults', payload: []});
    }
  }, [debouncedSearchValue]);

  // fetch the user's groups on mount
  React.useEffect(() => {
    GroupRequest.getGroupsForUser({count: 15, date: new Date()})
      .then(res => res.data)
      .then(data => {
        const onLeft = (errors: t.Errors) => {
          console.error('Error validating getting groups for user: ', errors);
        }

        const onRight = (data: GroupMessageDataArr) => {
          setGroups(data);
        }
        pipe(GroupMessageDataArr.decode(data), fold(onLeft, onRight));
      })
      .catch(error => console.error(error));
  }, []);

  // WEBSOCKET stuff happens here
  // handle group id changing: i.e. moving into a different chat room
  React.useEffect(() => {
    const disconnect = () => {
      if(ws.current !== null) ws.current.close();
    }

    ws.current = new WebSocket(WSURL);

    if(!groupId) {
      console.log('No groupId url parameter detected. Unable to open websocket.');
      disconnect();
      return;
    }
    const intGroupId = parseInt(groupId);

    const token = getToken();
    if(!token) {
      console.log('No token found. Unable to open websocket.');
      disconnect();
      return;
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
        const insertIntoMessageList = (sender: UserData) => {
          const displayableMessage = createDisplayableMessage(message.payload.userId, sender, html, message);
          const updatedMessages = [...messages];
          // array is displayed backwards, later messages should come first
          updatedMessages.unshift(displayableMessage);
          setMessages(updatedMessages);
        }

        console.log("Chat Message: ", message);
        // messages are recieved as strings but must be displayed as HTML
        const html = parseStringToHtml(message.payload.message);
        const sender = groupState.userMap.get(message.payload.userId);

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
          groupId: intGroupId,
          token: token,
        }
      }
      if(ws.current) ws.current.send(JSON.stringify(authMessage));
    };

    // populate the group meta data
    GroupRequest.getGroupWithUsers({groupId: intGroupId})
      .then(res => res.data)
      .then(data => {

        const onLeft = (errors: t.Errors) => {
          console.error("Validation error getting group data with users: ", errors);
        }

        const onRight = (data: GroupDataWithUsers) => {
          groupDispatch({type: "setGroupData", payload: data});
        }

        pipe(GroupDataWithUsers.decode(data), fold(onLeft, onRight));
      })
      .catch(error => console.error(error));


    // disconnect from WS on unmount
    return disconnect();
  }, [groupId]); // connect to a new chat room everytime we get a new groupid

  // send message here essentially
  const handleSendMessage = (e:React.KeyboardEvent<HTMLDivElement>) => {
    // hardcoded Demo data should be replaced later
    if(groupId){
      const intGroupId = parseInt(groupId);

      const newMessage = processSendMessageEvent(e, "chat", storeState.id, intGroupId);

      if(newMessage && ws.current) {
        ws.current.send(JSON.stringify(newMessage));

      } else console.error(`Unable to send websocket message\nWeboscket status: ${ws.current}`)
      // reset the chat box
    }
    e.currentTarget.textContent = "";
  }



  React.useEffect(() => {
    if (userSearchState.creatingGroup && debouncedUserSearch) {
      userSearchDispatch({type: "setIsSearching", payload: true});

      SearchRequest.getSearchUsers({
        count: 15,
        search: debouncedUserSearch 
      })
      .then(res => res.data)
      .then(data => {

        const onLeft = (errors: t.Errors) => {
          console.error('Error validating create group search request: ', errors);
        }

        const onRight = (data: UserDataArr) => {
          userSearchDispatch({type: 'setUserList', payload: data});
        }
        pipe(UserDataArr.decode(data), fold(onLeft, onRight));
        userSearchDispatch({type: "setIsSearching", payload: false});
      })
      .catch(error => {
        console.error(error);
        userSearchDispatch({type: "setIsSearching", payload: false});
      })
    } else {
      userSearchDispatch({type: 'setUserList', payload: []});
    }
  }, [userSearchState.creatingGroup]);

  const handleCreateGroup = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    userSearchDispatch({type: 'setCreateGroup', payload: true});
    const placeholderGroup = {
      userId: -1,
      groupId: -1,
      groupName: 'New Message',
      lastTimestamp: new Date(),
      lastMessage: "",
      lastUserId: -1,
    } as GroupMessageData;

    groups.unshift(placeholderGroup);
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
          moreOptionsClick={(e) => {
            deleteToken();
            return <Redirect to="/"/>
          }}
          newGroupClick={(e) => {return}/* TODO: this should open another search bar to create a new group */}
          groupData={groups}
          onSearch={(e) => searchDispatch({type: 'setSearchValue', payload: e.currentTarget.value})}
          searchValue={searchState.searchValue}
          searchResults={searchState.searchResults}
        />
      </Box>
      <Flex 
        width="100%"
        flexDir="column"
        justify="space-between"
        height="100vh"
      >
        <Box>
          <TopAvatarPanel 
            username={groupState.data.name} 
            onInfoClick={(e) => setToggleInfo(!toggleInfo)}
          />
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
