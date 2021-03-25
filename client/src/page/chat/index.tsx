import * as React from 'react';
import { createRef, useContext, useEffect, useReducer, useState, useRef } from 'react';
// store
import { StoreContext } from '../../store';
// chakra
import { Box } from '@chakra-ui/react';
// page panel
import { TopAvatarPanel, UserSearchPanel } from './toppanel';
import { MessageList } from '../../component/chat/messagelist';
import { BottomPanel } from './bottompanel';
import { GroupPanel } from './grouppanel';
import { InfoPanel } from './infopanel';
import { PanelFrame } from '../../component/panel/panelFrame';
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
import { useDebounce, useSearch, useValidator } from '../../util';
// api / validators
import { SearchRequest, GroupRequest, axiosAuth } from '../../api';
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
  const ws = useRef<WebSocket | null>(null);
  // the groupId the user is requesting
  const { groupId } = useParams<{groupId?: string}>(); 
  const [currentGroupId, setCurrentGroupId] = useState<number>(-1);

  // global store
  const { storeState } = useContext(StoreContext);

  // messages to be displayed
  const [messages, setMessages] = useState<DisplayableMessage[]>([]);
  // groups to be displayed on the group panel
  const [groups, setGroups] = useState<GroupMessageData[]>([]); 

  // stores meta data for the current chat group
  const [groupState, groupDispatch] = useReducer(groupReducer, groupInitialState);
  
  // toggle the info panel
  const [toggleInfo, setToggleInfo] = useState<boolean>(true);
  const [logout, setLogout] = useState(false);
  // handle scroll to bottom
  const msgDivRef= createRef<HTMLDivElement>();

  // group search on left panel
  const SEARCHCOUNT = 30;
  const groupSearch = useSearch(500, axiosAuth, '/api/search/group', SEARCHCOUNT);
  const groupResult = useValidator(GroupArrValidator, groupSearch.data, []);

  // user search on top panel
  const userSearch = useSearch(500, axiosAuth, '/api/search/user', SEARCHCOUNT);
  const userResult = useValidator(UserArrValidator, userSearch.data, []); 
  // new group creation
  type userId = number;
  const [newGroup, setNewGroup] = useState<Map<userId, UserData>>(new Map());
  const [isCreatingGroup, setIsCreatingGroup] = useState<boolean>(false);

  // fetch the user's groups on mount
  useEffect(() => {
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
  useEffect(() => {
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
  useEffect(() => {
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

  const createNewGroup = (_e: React.MouseEvent<HTMLButtonElement>): void => {
    const userIds = Array.from(newGroup, ([_key, value]) => value.id);

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
      })
      .catch(err => {
        console.error(err)
      });
  }
  

  return(
    <PanelFrame variant="screen">
      {(currentGroupId !== -1) && <Redirect to={`/chat/${currentGroupId}`}/>}
      {logout && <Redirect to="/"/>}
      <PanelFrame variant="sidePanel">
        <GroupPanel
          username={storeState.name}
          avatarSrc={storeState.avatar}
          moreOptionsClick={(_e):void => {
            deleteToken();
            setLogout(true);
          }}
          onGroupClick={(_e, id): void => {
            setCurrentGroupId(id);
          }}
          newGroupClick={(_e): void => {setIsCreatingGroup(true)}}
          groupData={groups}
          onSearch={(e):void => groupSearch.setInputValue(e.currentTarget.value)}
          searchValue={groupSearch.inputValue}
          searchResults={groupResult.data}
          onSearchResultClick={(_e, group): void => {
            setCurrentGroupId(group.id);
          }}
        />
      </PanelFrame>
      <PanelFrame variant="centerPanel">
        <Box>
          {isCreatingGroup
            ? 
            <UserSearchPanel
              searchValue={userSearch.inputValue}
              onInputChange={(e):void => {userSearch.setInputValue(e.currentTarget.value); }}
              searchResults={userResult.data.reduce((showArr, user) => {
                // remove any user from search reuslts that we've already chosen
                if(!newGroup.has(user.id)) showArr.push(user);
                return showArr;
              }, [] as UserData[])}
              onResultClick={(_e, user):void => {
                userSearch.setInputValue('');
                setNewGroup(newGroup.set(user.id, user));
              }}
              newUserGroup={/*convert map to arr to display*/Array.from(newGroup, ([key, value]) => value)}
              onCreateClick={createNewGroup}
              disableButton={userSearch.isSearching}
            />
            : 
            <TopAvatarPanel 
              username={groupState.name} 
              onInfoClick={(_e):void => setToggleInfo(!toggleInfo)}
            />
          }
        </Box>
        <PanelFrame variant="messagePanel" ref={msgDivRef}>
          {!isCreatingGroup &&
            <MessageList
              messages={messages}
              currentUserId={storeState.id}
            />
          }
        </PanelFrame>
        <BottomPanel 
          onMessageSubmit={handleSendMessage} 
          rightPanelStatus={toggleInfo}
        />
      </PanelFrame>

      { toggleInfo &&
        <PanelFrame variant="sidePanel">
          <InfoPanel/>
        </PanelFrame>
      }
    </PanelFrame>
  );
}
