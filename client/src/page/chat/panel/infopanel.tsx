import * as React from 'react';
import { SidePanel } from '../../../component/panel/sidepanel';
import {
  Avatar,
  Box, 
  Center,
  Flex,
  Heading,
  IconButton,
  useMultiStyleConfig
} from '@chakra-ui/react';
import { ListItem, ListItemIcon } from '../../../component/listItem';
import { GroupData, UserData } from '../../../api/validators/entity';
import { ImageIcon, PlusIcon, SignOutIcon, UserIcon, UsersIcon } from '../../../component/icon';

interface InfoPanelProps {
  group: GroupData;
  members: UserData[];
}
export const InfoPanel: React.FC<InfoPanelProps> = ({
  group, 
  members,
}) => {
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
        />
        <ListItemIcon
          title="Change Photo"
          variant="groupOptions"
          icon={<ImageIcon/>}
        />
        <ListItemIcon
          title="Leave group"
          variant="groupOptions"
          icon={<SignOutIcon/>}
        />
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
      </Flex>
    </SidePanel>
  );
}