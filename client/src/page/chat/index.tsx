import * as React from 'react';
// store
import { StoreContext } from '../../store';
// chakra
import { Box, Flex } from '@chakra-ui/react';
// page panel
import { TopAvatarPanel, UserSearchPanel } from './toppanel';
import { MessageList } from '../../component/chat/messagelist';
import { BottomPanel } from './bottompanel';
import { GroupPanel } from './grouppanel';
import { InfoPanel } from './infopanel';
// processing functions
import { processSendMessageEvent } from '../../component/chat/chatinput';
import  { parseStringToHtml } from '../../component/chat/htmlchatmessage';
// websocket 
import { 
  ChatHistory, 
  RxChatMessage, 
  ServerMessage, 
  ServerMessageValidator,
  RxChatMessageValidator,
  ChatHistoryValidator,
  
} from '../../api/validators/websocket';
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
import { SearchRequest, GroupRequest } from '../../api';
import { 
  GroupMessageDataArr, 
  UserData, 
  UserDataArr, 
  GroupData, 
  GroupDataArr, 
  GroupDataWithUsers, 
  GroupMessageData,
  GroupMessageDataArrValidator, 
  UserDataArrValidator, 
  GroupDataValidator, 
  GroupDataArrValidator, 
  GroupDataWithUsersValidator, 
} from '../../api/validators/entity';
import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/Either';
import * as t from 'io-ts';
import { PathReporter } from 'io-ts/PathReporter'

// When a user connects to a room
function createDisplayableMessage(userId: number, groupUser: UserData, htmlMessage: React.ReactNode, timestamp: Date): DisplayableMessage{
  return {
    userId: userId,
    name: groupUser.name,
    avatarSrc: groupUser.avatar || undefined,
    timestamp: timestamp,
    message: htmlMessage,
  };
}

// handle searching
type SEARCHACTIONTYPE = 
  | {type: 'setSearchValue', payload: string}
  | {type: 'setIsSearching', payload: boolean}
  | {type: 'setSearchResults', payload: GroupDataArr}
  | {type: 'resetState'};
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
    case 'resetState':
      return searchInitialState;
  }
}

// caching current group meta data including users data
export type GroupUsers = Map<number, UserData>

type GROUPACTIONTYPE = | {type: 'setGroupData', payload: GroupDataWithUsers};

const groupInitialState ={
  userMap: new Map() as GroupUsers,
  data: {
    id: -1,
    name: '',
    created: new Date(),
    updated: new Date(),
    avatar: null,
  } as GroupData,
};

function groupReducer(state: typeof groupInitialState, action: GROUPACTIONTYPE): typeof groupInitialState{
  switch(action.type){
    case 'setGroupData':
      
      const createUserMap = () => {
        return (action.payload.users.reduce((map, user) => {
          map.set(user.id, user);
          return map;
        }, new Map() as GroupUsers));
      }

      const userMap = createUserMap();

      return{...state, 
        userMap: userMap,
        data: action.payload,
      }

    default:
      return state;
  }
}

// handling user search when creating a new group
type USERSEARCHACTIONTYPE = 
| {type: 'creatingGroup', payload: boolean}
| {type: 'setSearchString', payload: string}
| {type: 'setUserList', payload: UserDataArr}
| {type: 'setIsSearching', payload: boolean}
| {type: 'appendNewGroup', payload: UserData}
| {type: 'postingNewGroup', payload: boolean}
| {type: 'resetState'}

const userSearchInitialState = {
  creatingGroup: false,
  searchString: "",
  userList: [] as UserDataArr,
  isSearching: false,
  newGroup: [] as UserDataArr,
  currentUserIds: new Set() as Set<number>,
  postingNewGroup: false,
}

function userSearchReducer( state: typeof userSearchInitialState, action: USERSEARCHACTIONTYPE): typeof userSearchInitialState{
  switch(action.type){
    case 'creatingGroup': 
      return {...state, creatingGroup: action.payload};
    case 'setSearchString':
      return {...state, searchString: action.payload};
    case 'setUserList':
      // remove users from search results that are already in the group
      const removeChosenUsers = () => {
        for(let i=0; i< action.payload.length; i++){
          if(state.currentUserIds.has(action.payload[i].id)) action.payload.splice(i, 1);
        }
      }
      removeChosenUsers();
      return {...state, userList: action.payload};
    case 'setIsSearching':
      return {...state, isSearching: action.payload};
    case 'appendNewGroup':

      const alreadyInArr = () => {
        for(let user of state.newGroup){
          if(user.id === action.payload.id) return true;
        }
        return false;
      }

      if(alreadyInArr()) return {...state};

      state.currentUserIds.add(action.payload.id);
      return {
        ...state, 
        newGroup: [...state.newGroup, action.payload], 
        currentUserIds: state.currentUserIds
      };
    case 'postingNewGroup':
      return {...state, postingNewGroup: action.payload}
    case 'resetState':
      return userSearchInitialState
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
  const [messages, setMessages] = React.useState<DisplayableMessage[]>([]);
  // groups to be displayed on the group panel
  const [groups, setGroups] = React.useState<GroupMessageData[]>([]); 

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

  // this is populated on load
  const [currentGroupId, setCurrentGroupId] = React.useState<number>(-1);

  const [logout, setLogout] = React.useState(false);
  // handle scroll to bottom
  const msgDivRef= React.createRef<HTMLDivElement>();

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

          pipe(GroupDataArrValidator.decode(data), fold(onLeft, onRight));
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
    if(groupId){
      setCurrentGroupId(parseInt(groupId));
    }

    GroupRequest.getGroupsForUser({count: 15, date: new Date()})
      .then(res => res.data)
      .then(data => {
        const onLeft = (errors: t.Errors) => {
          console.error('Error validating getting groups for user: ', errors);
        }

        const onRight = async  (data: GroupMessageDataArr) => {
          console.log(data);
          setGroups(data);
        }
        pipe(GroupMessageDataArrValidator.decode(data), fold(onLeft, onRight));
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
        console.log('Server message validation error: ', PathReporter.report(ServerMessageValidator.decode(message)));

        const onLeft = (errors: t.Errors) => {
          console.log('Unable to validate chat history message', PathReporter.report(ChatHistoryValidator.decode(message)));
        console.log("Unable to validate recieved message at websocket.");
        }

        const onRight = (message: ChatHistory) => {
          const displayMsg: Array<DisplayableMessage> = new Array();
          message.payload.forEach((msg) => {
            const html = parseStringToHtml(msg.message);
            const sender = groupState.userMap.get(msg.userId);
            if(sender){
              displayMsg.push(createDisplayableMessage(msg.userId, sender, html, msg.timestamp));
            }
          });
          setMessages(messages => displayMsg);

        }

        pipe(ChatHistoryValidator.decode(message), fold(onLeft, onRight));
      }
      const handleServerMessage = (message: ServerMessage) => {
        console.log('Server Message: ', message)
      }

      // if ChatMessage decode fails, pipe into ServerMessage
      const tryServerMessage = (errors: t.Errors) => {
        console.log('Chat message validation error: ', PathReporter.report(RxChatMessageValidator.decode(message)));
        pipe(ServerMessageValidator.decode(message), fold(onBadMessage, handleServerMessage));
      }

      const handleNewMessage = (message: RxChatMessage) => {

        const reorderGroups = () => {
          for(let i=0; i<groups.length; i++){
            if(groups[i].groupId === currentGroupId){
              const copy = [...groups];
              const insertGroup = copy.splice(i, 1);
              copy.unshift(insertGroup[0]);
              setGroups(groups => copy);
              break;
            }
          }
        }
        console.log("Chat Message: ", message);
        // messages are recieved as strings but must be displayed as HTML
        const html = parseStringToHtml(message.payload.message);
        const sender = groupState.userMap.get(message.payload.userId);
        const id = message.payload.userId;
        const timestamp= message.payload.timestamp;

        if(sender){
          const displayMsg = createDisplayableMessage(id, sender, html, timestamp);
          // array is displayed backwards, later messages should come first
          setMessages(messages => [displayMsg, ...messages]);
          reorderGroups();
        } else {
          // do a fetch request to get the data since we've evidently lost it
        }
      }
      // start here!
      pipe(RxChatMessageValidator.decode(message), fold(tryServerMessage, handleNewMessage));
    }

    ws.current.onopen = (event) => {
      // send the first message to get authenticated
      const authMessage: AuthMessage = {
        topic: "auth",
        payload: {
          timestamp: new Date(),
          groupId: currentGroupId,
          token: token,
        }
      }
      if(ws.current) ws.current.send(JSON.stringify(authMessage));
    };

    // populate the group meta data
    GroupRequest.getGroupWithUsers({groupId: currentGroupId})
      .then(res => res.data)
      .then(data => {

        const onLeft = (errors: t.Errors) => {
          console.error("Validation error getting group data with users: ", errors);
        }

        const onRight = (data: GroupDataWithUsers) => {
          groupDispatch({type: "setGroupData", payload: data});
        }

        pipe(GroupDataWithUsersValidator.decode(data), fold(onLeft, onRight));
      })
      .catch(error => console.error(error));

    // disconnect from WS on unmount
    return () => disconnect();
  }, [currentGroupId]); // connect to a new chat room everytime we get a new groupid

  // send message here essentially
  const handleSendMessage = (e:React.KeyboardEvent<HTMLDivElement>) => {
    // hardcoded Demo data should be replaced later
    if(currentGroupId !== -1){
      const newMessage = processSendMessageEvent(e, "chat", storeState.id, currentGroupId);

      if(newMessage && ws.current && ws.current.readyState === 1) {
        ws.current.send(JSON.stringify(newMessage));

      } else console.error(`Unable to send websocket message\nWeboscket status: ${ws.current}`)
      // reset the chat box
    }
    e.currentTarget.textContent = "";
  }

  // scroll to the bottom on new message if the user is at the top 
  React.useEffect(() => {
    const scrollToBottom = (ref: HTMLDivElement) => {
      const bottom =  ref.scrollHeight - ref.clientHeight;
      ref.scrollTo(0, bottom);
    }
    if(msgDivRef.current) {
      if(msgDivRef.current.scrollTop === 0){
        scrollToBottom(msgDivRef.current);
      }
    }
  }, [messages]);

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
          console.error('Error validating create group search request: ', PathReporter.report(UserDataArrValidator.decode(data)));
        }

        const onRight = (data: UserDataArr) => {
          userSearchDispatch({type: 'setUserList', payload: data});
        }

        pipe(UserDataArrValidator.decode(data), fold(onLeft, onRight));
        userSearchDispatch({type: "setIsSearching", payload: false});
      })
      .catch(error => {
        console.error(error);
        userSearchDispatch({type: "setIsSearching", payload: false});
      })
    } else {
      userSearchDispatch({type: 'setUserList', payload: []});
    }
  }, [debouncedUserSearch]);

  const createNewGroup = (e: React.MouseEvent<HTMLButtonElement>) => {
    const collectUserIds = () => {
      return userSearchState.newGroup.reduce(function (acc, user){
        acc.push(user.id);
        return acc;
      }, new Array() as number[]);
    }

    userSearchDispatch({type: 'postingNewGroup', payload: true});

    const userIds = collectUserIds();

    GroupRequest.postNewGroup({userIds: userIds, groupName: ""})
      .then(res => res.data)
      .then(data => {
        const onLeft = (errors: t.Errors) => {
          console.error(errors);
        }

        const onRight = (data: GroupData) => {
          // push the new group into the group list
          setCurrentGroupId(data.id);
        }
        pipe(GroupDataValidator.decode(data), fold(onLeft, onRight));
        userSearchDispatch({type: 'resetState'});
      })
      .catch(err => {
        console.error(err)
        userSearchDispatch({type: 'resetState'});
      });
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
      {(currentGroupId !== -1) && <Redirect to={`/chat/${currentGroupId}`}/>}
      {logout && <Redirect to="/"/>}
      <Box>
        <GroupPanel
          username={storeState.name}
          avatarSrc={storeState.avatar}
          moreOptionsClick={(e) => {
            deleteToken();
            setLogout(true);
          }}
          onGroupClick={(_e, id) => {
            setCurrentGroupId(id);
            userSearchDispatch({type: 'resetState'});
          }}
          newGroupClick={(_e) => {userSearchDispatch({type: 'creatingGroup', payload: true});}}
          groupData={groups}
          onSearch={(e) => searchDispatch({type: 'setSearchValue', payload: e.currentTarget.value})}
          searchValue={searchState.searchValue}
          searchResults={searchState.searchResults}
          onSearchResultClick={(e, group) => {
            setCurrentGroupId(group.id);
            searchDispatch({type: 'resetState'});
          }}
        />
      </Box>
      <Flex 
        width="100%"
        flexDir="column"
        justify="space-between"
        height="100vh"
      >
        <Box>
          {userSearchState.creatingGroup
            ? <UserSearchPanel
                searchValue={userSearchState.searchString}
                onInputChange={(e) => {userSearchDispatch({type: 'setSearchString', payload: e.currentTarget.value});}}
                searchResults={userSearchState.userList}
                onResultClick={(e, user) => {
                  userSearchDispatch({type: 'appendNewGroup', payload: user});
                  userSearchDispatch({type: 'setSearchString', payload: ""});
                }}
                newUserGroup={userSearchState.newGroup}
                onCreateClick={createNewGroup}
                disableButton={userSearchState.postingNewGroup}
              />
            : <TopAvatarPanel 
                username={groupState.data.name} 
                onInfoClick={(_e) => setToggleInfo(!toggleInfo)}
              />
          }
        </Box>
        <Box
          overflowY="auto"
          padding="5px"
          flexBasis="calc( 100vh - 54px - 70px )" // 54=bottom, 74=top 
          ref={msgDivRef}
        >
          {!userSearchState.creatingGroup &&
            <MessageList
              messages={messages}
              currentUserId={storeState.id}
            />
          }
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
