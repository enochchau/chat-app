import * as React from 'react';
import { SidePanel } from '../../../component/panel/sidepanel';
import {
  Avatar,
  Flex,
  Heading,
  IconButton,
  Text,
  Input,
} from '@chakra-ui/react';
import { ImageIcon, PlusIcon, SignOutIcon, UsersIcon, SearchIcon } from '../../../component/icon';
import { MyAlertDialog } from '../../../component/alertdialog';

import { GroupData, UserArrValidator, UserData } from '../../../api/validators/entity';
import { useSearch, useValidator } from '../../../util/hook';
import { axiosAuth } from '../../../api/index';

import { UserCheckList } from '../../../component/search/userchecklist';
import { SearchBar } from '../../../component/search/searchbar';
import { ListItem, ListItemIcon } from '../../../component/listItem';
import { UserTags } from '../../../component/usertag';

interface InfoPanelProps {
  group: GroupData;
  members: UserData[];
  onChangeName: (_newName: string) => void;
  onLeaveGroup: () => void;
  onAddPeople: (_e: React.MouseEvent<HTMLButtonElement>, _users: UserData[]) => void;
}
export const InfoPanel: React.FC<InfoPanelProps> = ({
  group, 
  members,
  onLeaveGroup,
  onChangeName,
  onAddPeople,
}) => {
  const [openChangeName, setOpenChangeName] = React.useState<boolean>(false);
  const [openLeaveGroup, setOpenLeaveGroup] = React.useState<boolean>(false);
  const [openAddUsers, setOpenAddUsers] = React.useState<boolean>(false);

  const [newUsers, setNewUsers] = React.useState<UserData[]>([]);
  const [newName, setNewName] = React.useState<string>(group.name);

  const search = useSearch(500, axiosAuth, '/api/search/user', 15);
  const searchResults = useValidator(UserArrValidator, search.data, []); 

  const memberIdSet = members.reduce((acc, user) => acc.add(user.id), new Set as Set<number>);

  const handleRemoveClick = (_e: React.MouseEvent<HTMLButtonElement>, user: UserData): void => {
    for(let i=0; i<newUsers.length; i++){
      if(newUsers[i] === user){
        const updateArr = [...newUsers];
        updateArr.splice(i, 1);
        setNewUsers(updateArr);
      }
    }
  }

  return(
    <SidePanel variant="rightPanel">
      <Flex flexDir="column" ml="8px" mr="8x">
        <Flex
          flexDir="column"
          alignItems="center"
          pt="16px"
          pb="16px"
          justifyContent="center"
        >
          <Avatar src={group.avatar || undefined} size="md" name={group.name}/>
          <Heading pt="16px" fontSize="md">{group.name}</Heading>
        </Flex>
        <ListItemIcon
          title="Change chat name"
          variant="groupOptions"
          icon={<UsersIcon/>}
          onClick={():void => setOpenChangeName(true)}
        />
        <MyAlertDialog
          cancelButtonText="Cancel"
          okayButtonText="Save"
          onOkayClick={(_e): void => onChangeName(newName)}
          header="Change chat name"
          isOpen={openChangeName}
          onClose={():void => {setOpenChangeName(false); setNewName(group.name);}}
          disableOkayButton={newName === group.name}
        >
          <Text fontSize="sm">
            Changing the name of a group chat changes it for everyone.
          </Text>
          <Input type="text" value={newName} onChange={(e): void => setNewName(e.currentTarget.value)}/>
        </MyAlertDialog>
        {/* <ListItemIcon
          title="Change Photo"
          variant="groupOptions"
          icon={<ImageIcon/>}
        /> */}
        <ListItemIcon
          title="Leave group"
          variant="groupOptions"
          icon={<SignOutIcon/>}
          onClick={(): void => setOpenLeaveGroup(true)}
        />
        <MyAlertDialog
          cancelButtonText="Cancel"
          okayButtonText="Leave Group"
          onOkayClick={onLeaveGroup}
          header="Leave group chat?"
          isOpen={openLeaveGroup}
          onClose={(): void => setOpenLeaveGroup(false)}
        >
          <Text fontSize="sm">
            You will stop receiving messages from this conversation.
          </Text>
        </MyAlertDialog>
        <Heading fontSize="md" padding="8px">Chat members</Heading>
        {
          members.map((user) => {
            return(
              <ListItem
                key={user.id}
                title={user.name}
                avatarSrc={user.avatar}
                avatarSize="sm"
                variant="groupOptions"
              />
            );
          })
        }
        <ListItemIcon
          title="Add people"
          variant="groupOptions"
          icon={
            <IconButton
              aria-label="Add people to chat"
              isRound
              size="md"
              fontSize="md"
              icon={<PlusIcon/>}
            />
          }
          onClick={(): void => setOpenAddUsers(true)}
        />
        <MyAlertDialog
          cancelButtonText="Cancel"
          okayButtonText="Add people"
          onOkayClick={(e):void => onAddPeople(e, newUsers)}
          header="Add people"
          isOpen={openAddUsers}
          onClose={(): void => {
            setOpenAddUsers(false);
            search.setInputValue(""); // reset search value on dialog close
          }}
          disableOkayButton={newUsers.length < 1}
        >
          <SearchBar
            value={search.inputValue}
            onChange={(e):void => search.setInputValue(e.currentTarget.value)}
            icon={<SearchIcon/>}
            variant="groupSearch"
          />
          <UserTags
            users={newUsers}
            onRemoveClick={handleRemoveClick}
          />
          <UserCheckList
            userData={searchResults.data.filter(user => !memberIdSet.has(user.id))}
            chosenUsers={newUsers}
            onChooseUser={(user):void => setNewUsers([...newUsers, user])}
          />
        </MyAlertDialog>
      </Flex>
    </SidePanel>
  );
}
