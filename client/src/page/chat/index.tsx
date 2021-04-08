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
import { GroupRequest, axiosAuth, MessageRequest } from '../../api';
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
  MessageValidator,
  MessageData,
} from '../../api/validators/entity';
import { pipe } from 'fp-ts/lib/function';
import { fold, left } from 'fp-ts/Either';
import { PathReporter } from 'io-ts/PathReporter'
import * as t from 'io-ts';
import { trimGroupName } from '../../util/trimName';

function createDisplayableMessage(message: MessageData, user: UserData): DisplayableMessage{
  return {
    messageId: message.id,
    userId: user.id,
    name: user.name,
    avatarSrc: user.avatar || undefined,
    timestamp: message.timestamp,
    message: parseStringToHtml(message.message),
    removed: message.message === "This message was unsent.",
  };
}
function bSearchId(id: number, messages: DisplayableMessage[]): number {
  // later messages come first, messages[] is sorted from largest to smallest id
  let lower = 0;
  let upper = messages.length-1; // not inclusive
  let mid = Math.floor((upper - lower) / 2);
  let current = messages[mid].messageId;
  let count = 0;

  // worst case is O(log(n)) so break out of loop after that to prevent infinite looping
  while(current !== id && count <= Math.log(messages.length)){
    if(current > id){
      lower = mid + 1;
      mid = Math.floor((upper - lower) / 2) + lower;
      current = messages[mid].messageId;
    }
    if(current < id){
      upper = mid - 1;
      mid = upper - Math.floor((upper - lower) / 2);
      current = messages[mid].messageId;
    }
    count += 1;
  }
  return mid;
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
    const fetchGroups = ():void => {
      GroupRequest.getGroupsForUser({count: 15, date: new Date()})
        .then(res => res.data)
        .then(data => {
          const onLeft = (errors: t.Errors): void => {
            throw Error(PathReporter.report(left(errors)).join('\n'));
          }

          const onRight = (data: Array<GroupMessageData>): void => {
            data.forEach(group => group.groupName = trimGroupName(group.groupName, storeState.name));
            setGroups(data);
            // set the group Id here!
            // we want to auto redirect the user if they are going to the default groupId page
            if(groupId && parseInt(groupId) === -1 && data.length > 0){
              setCurrentGroupId(data[0].groupId);
            }
          }
          pipe(GroupMessageArrValidator.decode(data), fold(onLeft, onRight));
        })
        .catch(error => console.error(error));
    }
    fetchGroups();
  }, [storeState, currentGroupData, currentGroupId]); 
  // handle errors
  // type ResponseError = {
  //   error: boolean,
  //   errMsg: any,
  // }
  // type ValidationError = {
  //   error: boolean,
  //   errMsg: string[],
  // }
  // const validationErrors: ValidationError[] = [
  //   {error: groupResult.error, errMsg: groupResult.errMsg},
  //   {error: userResult.error, errMsg: userResult.errMsg},
  // ];
  // const responseErrors: ResponseError[] = [
  //   {error: groupSearch.error, errMsg: groupSearch.errMsg},
  //   {error: userSearch.error, errMsg: userSearch.errMsg},
  // ];
  // useErrorPrinter(validationErrors);
  // useErrorPrinter(responseErrors);
  
  // WEBSOCKET stuff happens here
  // handle group id changing: i.e. moving into a different chat room
  useEffect(() => {
    const disconnect = (): void => {
      if(handler.current !== null) handler.current.ws.close();
    }

    const createWsHandler = (userData: UserData[]):void => {

      // create the websocket after getting the group's users meta data
      handler.current = new ChatHandler(userData);
      
      const token = getToken();
      if(!token) {
        console.log('No token found. Unable to open websocket.');
        disconnect();
      } else {

        // setup the message handler
        handler.current.ws.onmessage = (event): void => {
          const handleHistMessage = (message: ChatHistory): void => {
            const displayMsg: Array<DisplayableMessage> = [];
            message.payload.forEach((msg) => {
              const sender = handler.current?.groupMap.get(msg.userId);
              if(sender){
                displayMsg.push(createDisplayableMessage(msg, sender));
              }
            });

            setMessages(_messages => displayMsg);
          }

          const handleServerMessage = (message: ServerMessage): void => {
            // probably parse this for errors...
            console.log(message);
          }

          const handleNewMessage = (message: RxChatMessage): void => {

            const reorderGroups = (message: RxChatMessage): void => {
              for(let i=0; i<groups.length; i++){
                if(groups[i].groupId === currentGroupId){
                  const copy = [...groups];
                  const insertGroup = copy.splice(i, 1)[0];
                  copy.unshift({
                    userId: insertGroup.userId,
                    groupName: insertGroup.groupName,
                    groupId: insertGroup.groupId,
                    groupAvatar: insertGroup.groupAvatar,
                    lastTimestamp: message.payload.timestamp,
                    lastMessage: message.payload.message,
                    lastUserId: message.payload.userId,
                  });
                  setGroups(_groups => copy);
                  break;
                }
              }
            }

            const sender = handler.current?.groupMap.get(message.payload.userId);
            if(sender){
              const displayMsg = createDisplayableMessage(message.payload, sender);
              // array is displayed backwards, later messages should come first
              setMessages(messages => [displayMsg, ...messages]);
              reorderGroups(message);
            } else {
              // do a fetch request to get the data since we've evidently lost it
            }
          }

          const message = JSON.parse(event.data);
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
    }

    const fetchGroupData = async (): Promise<void | GroupDataWithUsers> => {
      // populate the group meta data
      return GroupRequest.getGroupWithUsers({groupId: currentGroupId})
        .then(res => res.data)
        .then(data => {

          const onLeft = (errors: t.Errors): GroupDataWithUsers=> {
            throw Error(PathReporter.report(left(errors)).join('\n'));
          }

          const onRight = (data: GroupDataWithUsers): GroupDataWithUsers=> {
            data.name = trimGroupName(data.name, storeState.name);
            setCurrentGroupData(data);
            return data;
          }
          return pipe(GroupWithUsersValidator.decode(data), fold(onLeft, onRight));
        })
    }

    fetchGroupData()
      .then(data => {if(data) createWsHandler(data.users);})
      .catch(error => console.error(error));


    // disconnect from WS on unmount
    return ():void => {disconnect()};
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

        const onRight = (data: GroupData):void => {
          // add new group to group array
          setGroups([{
            userId: storeState.id,
            groupId: data.id,
            groupName: trimGroupName(data.name, storeState.name),
            groupAvatar: data.avatar,
            lastTimestamp: null,
            lastMessage: null,
            lastUserId: null
          } , ...groups]);

          setCurrentGroupId(data.id);
        }
        
        console.log(data);
        pipe(GroupValidator.decode(data), fold(onLeft, onRight));
        setIsCreatingGroup(false);
      })
      .catch(err => {console.error(err)});
  }

  const removeMessage = (_e: React.MouseEvent<HTMLButtonElement>, id: number): void => {
    MessageRequest.removeMessage({messageId: id})
      .then(res => res.data)
      .then(data => {
        const onLeft = (_errors: t.Errors): void => {return};
        const onRight = (msg: MessageData): void => {
          const index = bSearchId(msg.id, messages);
          const copy = [...messages];
          copy[index].message = parseStringToHtml(msg.message);
          setMessages(copy);
        }
        pipe(MessageValidator.decode(data), fold(onLeft, onRight));
      })
      .catch(err => console.error(err))
  }

  const logout = (): void=> {
    deleteToken();
    setIsLogout(true);
  }

  const changeGroupName = (newName: string) => {
    GroupRequest.patchChangeName({groupId: currentGroupId, newName: newName})
      .then(res => res.data)
      .then(data => {
        const onLeft = (errors: t.Errors): void => {console.error(errors)}

        const onRight = (validData: GroupData):void => {
          setCurrentGroupData({...currentGroupData, name: validData.name});
        }

        pipe(GroupValidator.decode(data), fold(onLeft, onRight));
      })
      .catch(err => console.error(err));
  }

  const leaveGroup = (): void => {
    GroupRequest.patchLeaveGroup({groupId: currentGroupId})
      .then(_res => {
        for(let group of groups){
          if(group.groupId !== currentGroupId){
            setCurrentGroupId(group.groupId)
            break;
          }
        }
      })
      .catch(err => console.error(err));
  }

  const addGroupMember = (_e: React.MouseEvent<HTMLButtonElement>, newUsers: UserData[]): void => {
    const newUserIds = newUsers.reduce((acc, user) => {
      acc.push(user.id);
      return acc;
    }, [] as number[]);

    newUserIds.forEach(id => {
      GroupRequest.patchAddToGroup({groupId: currentGroupId, userId: id})
        .then((res) => res.data)
        .then(data => {
          const onLeft = (errors: t.Errors):void => console.error(PathReporter.report(left(errors)));
          const onRight = (group: GroupDataWithUsers): void => setCurrentGroupData(group);
          console.log(data);
          pipe(GroupWithUsersValidator.decode(data), fold(onLeft, onRight));
        })
        .catch(error => console.error(error));
    });
  }
  
  const trimSearchResults = (newGroup: UserData[]):UserData[]  => {
    const userIdSet = newGroup.reduce((acc, user) => acc.add(user.id), new Set());
    return userResult.data.filter(user => !userIdSet.has(user.id));
  }

  return(
    <PanelFrame variant="screen">
      <Redirect to={`/chat/${currentGroupId}`}/>
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
              searchResults={trimSearchResults(newGroup)}
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
              onRemoveClick={removeMessage}
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
          <InfoPanel
            group={currentGroupData}
            members={currentGroupData.users}
            onChangeName={changeGroupName}
            onLeaveGroup={leaveGroup}
            onAddPeople={addGroupMember}
          />
        </PanelFrame>
      }
    </PanelFrame>
  );
}
