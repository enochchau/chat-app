import * as React from 'react';
import { useContext, useEffect, useState, useRef } from 'react';
import { useSearch, useValidator, useScrollToBottomIfAtTop, useErrorPrinter } from '../../util/hook';
// store
import { StoreContext } from '../../store';
// chakra
import { Box } from '@chakra-ui/react';
// page panel
import { TopAvatarPanel, UserSearchPanel } from './panel/toppanel';
import { MessageList } from '../../component/chat/messagelist';
import { BottomPanel } from './panel/bottompanel';
import { GroupPanel } from './panel/grouppanel';
import { InfoPanel } from './panel/infopanel';
import { PanelFrame } from '../../component/panel/panelFrame';
// processing functions
import { processSendMessageEvent } from '../../component/chat/chatinput';
import  { parseStringToHtml } from '../../component/chat/htmlchatmessage';
// websocket 
import { 
  ChatHistory, 
  RxChatMessage,
  ServerMessage, 
} from '../../api/validators/websocket';
import { ChatHandler } from './websocket';
import { AuthMessage } from '../../api/validators/websocket';
// websocket text -> HTML
import { DisplayableMessage } from '../../component/chat/messagelist/index';
// router
import { Redirect, useParams } from 'react-router';
// token
import { getToken, deleteToken } from '../../api/token';
// api / validators
import { GroupRequest, axiosAuth } from '../../api';
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

const groupInitialState = {
  id: -1,
  name: '',
  created: new Date(),
  updated: new Date(),
  avatar: null,
  users: [],
} as GroupDataWithUsers;

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
  const handler = useRef<ChatHandler | null>(null);

  // current group data
  const { groupId } = useParams<{groupId?: string}>(); 
  const [currentGroupId, setCurrentGroupId] = useState<number>(-1);
  const [currentGroupData, setCurrentGroupData] = useState<GroupDataWithUsers>(groupInitialState);

  // global store with current user's meta data
  const { storeState } = useContext(StoreContext);

  // messages to be displayed
  const [messages, setMessages] = useState<DisplayableMessage[]>([]);
  // groups to be displayed on the group panel
  const [groups, setGroups] = useState<GroupMessageData[]>([]); 
  
  // toggle the info panel
  const [toggleInfo, setToggleInfo] = useState<boolean>(false);
  const [isLogout, setIsLogout] = useState(false);
  // handle scroll to bottom
  const msgDivRef = useScrollToBottomIfAtTop([messages]);

  // group search on left panel
  const SEARCHCOUNT = 30;
  const groupSearch = useSearch(500, axiosAuth, '/api/search/group', SEARCHCOUNT);
  const groupResult = useValidator(GroupArrValidator, groupSearch.data, []);

  // user search on top panel
  const userSearch = useSearch(500, axiosAuth, '/api/search/user', SEARCHCOUNT);
  const userResult = useValidator(UserArrValidator, userSearch.data, []); 
  // new group creation
  const [newGroup, setNewGroup] = useState<UserData[]>([]);
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

  // handle errors
  // TODO: write a better error handler
  type ResponseError = {
    error: boolean,
    errMsg: any,
  }
  type ValidationError = {
    error: boolean,
    errMsg: string[],
  }
  const validationErrors: ValidationError[] = [
    {error: groupResult.error, errMsg: groupResult.errMsg},
    {error: userResult.error, errMsg: userResult.errMsg},
  ];
  const responseErrors: ResponseError[] = [
    {error: groupSearch.error, errMsg: groupSearch.errMsg},
    {error: userSearch.error, errMsg: userSearch.errMsg},
  ];
  // useErrorPrinter(validationErrors);
  // useErrorPrinter(responseErrors);
  
  // WEBSOCKET stuff happens here
  // handle group id changing: i.e. moving into a different chat room
  useEffect(() => {
    const disconnect = (): void => {
      if(handler.current !== null) handler.current.ws.close();
    }
    // populate the group meta data
    GroupRequest.getGroupWithUsers({groupId: currentGroupId})
      .then(res => res.data)
      .then(data => {

        const onLeft = (errors: t.Errors):void => {
          console.error("Validation error getting group data with users: ", errors);
        }

        const onRight = (data: GroupDataWithUsers): void => {
          setCurrentGroupData(data);

          // create the websocket after getting the group's users meta data
          handler.current = new ChatHandler(data.users);
          
          const token = getToken();
          if(!token) {
            console.log('No token found. Unable to open websocket.');
            disconnect();
            return;
          }

          // setup the message handler
          handler.current.ws.onmessage = (event): void => {

            const message = JSON.parse(event.data);

            const handleHistMessage = (message: ChatHistory): void => {
              const displayMsg: Array<DisplayableMessage> = [];
              message.payload.forEach((msg) => {
                const html = parseStringToHtml(msg.message);
                const sender = handler.current?.groupMap.get(msg.userId);
                if(sender){
                  displayMsg.push(createDisplayableMessage(msg.userId, sender, html, msg.timestamp));
                }
              });

              setMessages(_messages => displayMsg);
            }

            const handleServerMessage = (message: ServerMessage): void => {
              console.log(message);
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
              const sender = handler.current?.groupMap.get(message.payload.userId);
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

            handler.current?.validateMessage(message, handleNewMessage, handleServerMessage, handleHistMessage)
          }

          handler.current.ws.onopen = (_event): void => {
            // send the first message to get authenticated
            const authMessage: AuthMessage = {
              topic: "auth",
              payload: {
                timestamp: new Date(),
                groupId: currentGroupId,
                token: token,
              }
            }
            if(handler.current) handler.current.ws.send(JSON.stringify(authMessage));
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

      if(newMessage && handler.current && handler.current.ws.readyState === 1) {
        handler.current.ws.send(JSON.stringify(newMessage));

      } else console.error(`Unable to send websocket message\nWeboscket status: ${handler.current?.ws.readyState}`)
      // reset the chat box
    }
    e.currentTarget.textContent = "";
  }

  const createNewGroup = (_e: React.MouseEvent<HTMLButtonElement>): void => {
    const userIds = newGroup.map(user => user.id);

    GroupRequest.postNewGroup({userIds: userIds, groupName: ""})
      .then(res => res.data)
      .then(data => {
        const onLeft = (errors: t.Errors):void => {console.error(errors);}

        const onRight = (data: GroupData):void => {setCurrentGroupId(data.id);}
        
        console.log(data);
        pipe(GroupValidator.decode(data), fold(onLeft, onRight));
        setIsCreatingGroup(false);
      })
      .catch(err => {console.error(err)});
  }

  const logout = (): void=> {
    deleteToken();
    setIsLogout(true);
  }
  
  const trimSearchResults = ():UserData[]  => {
    const userMap = new Map();
    for(let user of newGroup){
      userMap.set(user.id, user);
    }
    return userResult.data.reduce((acc, user) => {
      if(!userMap.has(user.id)) acc.push(user);
      return acc;
    }, [] as UserData[]);
  }

  return(
    <PanelFrame variant="screen">
      {(currentGroupId !== -1) && <Redirect to={`/chat/${currentGroupId}`}/>}
      {isLogout && <Redirect to="/"/>}
      <PanelFrame variant="sidePanel">
        <GroupPanel
          username={storeState.name}
          avatarSrc={storeState.avatar}
          moreOptionsClick={(_e):void => {logout();}}
          onGroupClick={(_e, id): void => {
            if(isCreatingGroup) setIsCreatingGroup(false);
            setCurrentGroupId(id);
          }}
          newGroupClick={(_e): void => {setIsCreatingGroup(true)}}
          groupData={groups}
          onSearch={(e):void => groupSearch.setInputValue(e.currentTarget.value)}
          searchValue={groupSearch.inputValue}
          searchResults={groupResult.data}
          onSearchResultClick={(_e, group): void => {setCurrentGroupId(group.id);}}
        />
      </PanelFrame>
      <PanelFrame variant="centerPanel">
        <Box>
          {isCreatingGroup
            ? 
            <UserSearchPanel
              searchValue={userSearch.inputValue}
              onInputChange={(e):void => {userSearch.setInputValue(e.currentTarget.value); }}
              searchResults={trimSearchResults()}
              onResultClick={(_e, user):void => {
                // reset search results
                userSearch.setInputValue('');
                userResult.setData([]);
                setNewGroup([...newGroup, user]);
              }}
              newUserGroup={newGroup}
              onClickRemoveNewUser={(_e, user): void => {
                for(let i=0; i<newGroup.length; i++){
                  if(newGroup[i] === user){
                    const updateArr = [...newGroup];
                    updateArr.splice(i, 1);
                    setNewGroup(updateArr);
                  }
                }
              }}
              onCreateClick={createNewGroup}
              disableButton={userSearch.isSearching}
            />
            : 
            <TopAvatarPanel 
              username={currentGroupData.name} 
              onInfoClick={(_e):void => setToggleInfo(!toggleInfo)}
            />
          }
        </Box>
        <PanelFrame variant="messagePanel" ref={msgDivRef}>
          {!isCreatingGroup &&
            <MessageList
              messages={messages}
              currentUserId={storeState.id}
              userCount={currentGroupData.users.length}
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
