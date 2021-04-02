import * as React from 'react';
import { SidePanel } from '../../../component/panel/sidepanel';
import {
  Avatar,
  Box, 
  Center,
  Flex,
  Heading,
  IconButton,
  useMultiStyleConfig,
  Text,
  Input,
} from '@chakra-ui/react';
import { ListItem, ListItemIcon } from '../../../component/listItem';
import { GroupData, UserData } from '../../../api/validators/entity';
import { ImageIcon, PlusIcon, SignOutIcon, UsersIcon } from '../../../component/icon';
import { MyAlertDialog } from '../../../component/alertdialog';

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
        />
        <MyAlertDialog
          cancelButtonText="Cancel"
          okayButtonText="Add people"
          onOkayClick={(e) => onAddPeople(e, newUsers)}
          header="Add people"
          isOpen={openAddUsers}
          onClose={(): void => setOpenAddUsers(false)}
        >
          <Text fontSize="sm">
            You will stop receiving messages from this conversation.
          </Text>
        </MyAlertDialog>
      </Flex>
    </SidePanel>
  );
}

// interface UserChecklistProps {

// }
// const UserChecklist: React.FC<UserChecklistProps> = ({}) => {

//   return(

//   );
// }