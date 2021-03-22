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
  UserData, 
  GroupData, 
  GroupDataWithUsers, 
  GroupMessageData,
  GroupMessageArrValidator, 
  UserArrValidator, 
  GroupValidator, 
  GroupArrValidator, 
  GroupWithUsersValidator, 
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
  | {type: 'setSearchResults', payload: Array<GroupData>}
  | {type: 'resetState'};
const groupSearchInitialState = {
  searchValue: "",
  isSearching: false,
  searchResults: [] as Array<GroupData>,
}
function groupSearchReducer(state: typeof groupSearchInitialState, action: SEARCHACTIONTYPE): typeof groupSearchInitialState{
  switch(action.type){
  case 'setSearchValue':
    return {...state, searchValue: action.payload};
  case 'setIsSearching':
    return {...state, isSearching: action.payload};
  case 'setSearchResults':
    return {...state, searchResults: action.payload};
  case 'resetState':
    return groupSearchInitialState;
  }
}

// caching current group meta data including users data
export type UserIdMap = Map<number, UserData>;
const createUserIdMap = (userData: UserData[]): UserIdMap => {
  return (userData.reduce((map, user) => {
    map.set(user.id, user);
    return map;
  }, new Map() as UserIdMap));
}

const groupInitialState = {
  id: -1,
  name: '',
  created: new Date(),
  updated: new Date(),
  avatar: null,
} as GroupData;

type GROUPACTIONTYPE = 
| {type: 'setGroupData', payload: GroupData}
| {type: 'resetState'} ;


function groupReducer(state: typeof groupInitialState, action: GROUPACTIONTYPE): typeof groupInitialState{
  switch(action.type){
  case 'setGroupData':
    return action.payload
  case 'resetState':
    return groupInitialState;
  default:
    return state;
  }
}

// handling user search when creating a new group
type USERSEARCHACTIONTYPE = 
| {type: 'creatingGroup', payload: boolean}
| {type: 'setSearchString', payload: string}
| {type: 'setUserList', payload: Array<UserData>}
| {type: 'setIsSearching', payload: boolean}
| {type: 'appendNewGroup', payload: UserData}
| {type: 'postingNewGroup', payload: boolean}
| {type: 'resetState'}

const userSearchInitialState = {
  creatingGroup: false,
  searchString: "",
  userList: [] as Array<UserData>,
  isSearching: false,
  newGroup: [] as Array<UserData>,
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
    return {...state, userList: action.payload};
  case 'setIsSearching':
    return {...state, isSearching: action.payload};
  case 'appendNewGroup':
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
export const ChatPage: React.FC = () => {
  // websocket
  const ws = React.useRef<WebSocket | null>(null);
  // the groupId the user is requesting
  const { groupId } = useParams<{groupId?: string}>(); 
  // global store
  const { storeState } = React.useContext(StoreContext);
  // messages to be displayed
  const [messages, setMessages] = React.useState<DisplayableMessage[]>([]);
  // groups to be displayed on the group panel
  const [groups, setGroups] = React.useState<GroupMessageData[]>([]); 

  // stores meta data for the current chat group
  const [groupState, groupDispatch] = React.useReducer(groupReducer, groupInitialState);

  // search value in the group panel search box
  const [groupSearchState, groupSearchDispatch] = React.useReducer(groupSearchReducer, groupSearchInitialState);
  const dbGroupSearchValue = useDebounce<string>(groupSearchState.searchValue, 500);

  // handle user search when creating new groups
  const [userSearchState, userSearchDispatch] = React.useReducer(userSearchReducer, userSearchInitialState);
  const dbUserSearchValue = useDebounce<string>(userSearchState.searchString, 500);

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
    if(dbGroupSearchValue) {
      groupSearchDispatch({type: 'setIsSearching', payload: true});

      SearchRequest.getSearchGroups({
        count: 30, 
        search: dbGroupSearchValue
      })
        .then(res => res.data)
        .then(data => {
          const onLeft = (errors: t.Errors): void => {
            console.error('Error validating search request: ', errors);
          }
          const onRight = (data: Array<GroupData>): void => {
            groupSearchDispatch({type: 'setSearchResults', payload: data});
            console.log(data);
          }

          pipe(GroupArrValidator.decode(data), fold(onLeft, onRight));
          groupSearchDispatch({type: 'setIsSearching', payload: false});
        })
        .catch(error => {
          console.error(error);
          groupSearchDispatch({type: 'setIsSearching', payload: false});
        })

    } else {
      groupSearchDispatch({type: 'setSearchResults', payload: []});
    }
  }, [dbGroupSearchValue]);

  // fetch the user's groups on mount
  React.useEffect(() => {

    GroupRequest.getGroupsForUser({count: 15, date: new Date()})
      .then(res => res.data)
      .then(data => {
        const onLeft = (errors: t.Errors): void => {
          console.error('Error validating getting groups for user: ', errors);
        }

        const onRight = (data: Array<GroupMessageData>): void => {
          console.log(data);
          setGroups(data);
          // set the group Id here!
          // we want to auto redirect the user if they aren't going to a specific groupId page
          setCurrentGroupId(groupId ? parseInt(groupId) : data[0].groupId);
        }
        pipe(GroupMessageArrValidator.decode(data), fold(onLeft, onRight));
      })
      .catch(error => console.error(error));
  }, []);
  
  // WEBSOCKET stuff happens here
  // handle group id changing: i.e. moving into a different chat room
  React.useEffect(() => {
    const disconnect = (): void => {
      if(ws.current !== null) ws.current.close();
    }
    // populate the group meta data
    GroupRequest.getGroupWithUsers({groupId: currentGroupId})
      .then(res => res.data)
      .then(data => {

        const onLeft = (errors: t.Errors):void => {
          console.error("Validation error getting group data with users: ", errors);
        }

        const onRight = (data: GroupDataWithUsers): void => {
          
          const userMap = createUserIdMap(data.users);
          groupDispatch({type: 'setGroupData', payload: data})

          // create the websocket after getting the group's users meta data
          ws.current = new WebSocket(WSURL);
          
          const token = getToken();
          if(!token) {
            console.log('No token found. Unable to open websocket.');
            disconnect();
            return;
          }

          // setup the message handler
          ws.current.onmessage = (event): void => {

            const message = JSON.parse(event.data);

            const onBadMessage = (_errors: t.Errors): void => {
              console.log('Server message validation error: ', PathReporter.report(ServerMessageValidator.decode(message)));

              const onHistLeft = (_errors: t.Errors): void => {
                console.log('Unable to validate chat history message', PathReporter.report(ChatHistoryValidator.decode(message)));
                console.log("Unable to validate recieved message at websocket.");
              }

              const onHistRight = (message: ChatHistory): void => {
                const displayMsg: Array<DisplayableMessage> = new Array();
                message.payload.forEach((msg) => {
                  const html = parseStringToHtml(msg.message);
                  const sender = userMap.get(msg.userId);
                  if(sender){
                    displayMsg.push(createDisplayableMessage(msg.userId, sender, html, msg.timestamp));
                  }
                });

                setMessages(_messages => displayMsg);
              }

              pipe(ChatHistoryValidator.decode(message), fold(onHistLeft, onHistRight));
            }
            const handleServerMessage = (message: ServerMessage): void => {
              console.log('Server Message: ', message)
            }

            // if ChatMessage decode fails, pipe into ServerMessage
            const tryServerMessage = (_errors: t.Errors): void => {
              console.log('Chat message validation error: ', PathReporter.report(RxChatMessageValidator.decode(message)));
              pipe(ServerMessageValidator.decode(message), fold(onBadMessage, handleServerMessage));
            }

            const handleNewMessage = (message: RxChatMessage): void => {

              const reorderGroups = (): void => {
                for(let i=0; i<groups.length; i++){
                  if(groups[i].groupId === currentGroupId){
                    const copy = [...groups];
                    const insertGroup = copy.splice(i, 1);
                    copy.unshift(insertGroup[0]);
                    setGroups(_groups => copy);
                    break;
                  }
                }
              }
              // messages are recieved as strings but must be displayed as HTML
              const html = parseStringToHtml(message.payload.message);
              const sender = userMap.get(message.payload.userId);
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

          ws.current.onopen = (_event): void => {
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
        }

        pipe(GroupWithUsersValidator.decode(data), fold(onLeft, onRight));
      })
      .catch(error => console.error(error));

    // disconnect from WS on unmount
    return ():void => disconnect();
  }, [currentGroupId]); // connect to a new chat room everytime we get a new groupid

  // send message here essentially
  const handleSendMessage = (e:React.KeyboardEvent<HTMLDivElement>): void => {
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
    const scrollToBottom = (ref: HTMLDivElement): void => {
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
    if (userSearchState.creatingGroup && dbUserSearchValue) {
      userSearchDispatch({type: "setIsSearching", payload: true});

      SearchRequest.getSearchUsers({
        count: 15,
        search: dbUserSearchValue 
      })
        .then(res => res.data)
        .then(data => {

          const onLeft = (_errors: t.Errors): void => {
            console.error('Error validating create group search request: ', PathReporter.report(UserArrValidator.decode(data)));
          }

          const onRight = (data: Array<UserData>): void => {

            // remove users from search results that are already in the group
            const removeChosenUsers = (data: Array<UserData>): void => {
              for(let i=0; i<data.length; i++){
                if(userSearchState.currentUserIds.has(data[i].id)) data.splice(i, 1);
              }
            }

            removeChosenUsers(data);
            userSearchDispatch({type: 'setUserList', payload: data});
          }

          pipe(UserArrValidator.decode(data), fold(onLeft, onRight));
          userSearchDispatch({type: "setIsSearching", payload: false});
        })
        .catch(error => {
          console.error(error);
          userSearchDispatch({type: "setIsSearching", payload: false});
        });
    } else {
      userSearchDispatch({type: 'setUserList', payload: []});
    }
  }, [dbUserSearchValue]);

  const createNewGroup = (_e: React.MouseEvent<HTMLButtonElement>): void => {
    const collectUserIds = (): Array<number> => {
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
        const onLeft = (errors: t.Errors):void => {
          console.error(errors);
        }

        const onRight = (data: GroupData):void => {
          // push the new group into the group list
          setCurrentGroupId(data.id);
        }
        pipe(GroupValidator.decode(data), fold(onLeft, onRight));
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
          moreOptionsClick={(_e):void => {
            deleteToken();
            setLogout(true);
          }}
          onGroupClick={(_e, id): void => {
            setCurrentGroupId(id);
            userSearchDispatch({type: 'resetState'});
          }}
          newGroupClick={(_e): void => {userSearchDispatch({type: 'creatingGroup', payload: true});}}
          groupData={groups}
          onSearch={(e):void => groupSearchDispatch({type: 'setSearchValue', payload: e.currentTarget.value})}
          searchValue={groupSearchState.searchValue}
          searchResults={groupSearchState.searchResults}
          onSearchResultClick={(_e, group): void => {
            setCurrentGroupId(group.id);
            groupSearchDispatch({type: 'resetState'});
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
            ? 
            <UserSearchPanel
              searchValue={userSearchState.searchString}
              onInputChange={(e):void => {userSearchDispatch({type: 'setSearchString', payload: e.currentTarget.value});}}
              searchResults={userSearchState.userList}
              onResultClick={(_e, user):void => {

                const alreadyInArr = (checkUser: UserData, userArr: UserData[] ):boolean => {
                  for(let user of userArr){
                    if(user.id === checkUser.id) return true;
                  }
                  return false;
                }

                if(!alreadyInArr(user, userSearchState.newGroup)) userSearchDispatch({type: 'appendNewGroup', payload: user});
                userSearchDispatch({type: 'setSearchString', payload: ""});
              }}
              newUserGroup={userSearchState.newGroup}
              onCreateClick={createNewGroup}
              disableButton={userSearchState.postingNewGroup}
            />
            : 
            <TopAvatarPanel 
              username={groupState.name} 
              onInfoClick={(_e):void => setToggleInfo(!toggleInfo)}
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
