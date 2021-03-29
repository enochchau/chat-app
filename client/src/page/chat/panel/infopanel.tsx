import * as React from 'react';
import { SidePanel } from '../../../component/panel/sidepanel';
import {
  Avatar,
  Box, 
  Center,
  Flex,
  Heading
} from '@chakra-ui/react';
import { ListItem, ListItemIcon } from '../../../component/listItem';
import { GroupData, UserData } from '../../../api/validators/entity';

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
      <Flex flexDir="column">
        <Flex
          flexDir="column"
          alignItems="center"
          justifyContent="center"
        >
          <Avatar src={group.avatar || undefined} size="md" name={group.name}/>
          <Heading>{group.name}</Heading>
        </Flex>
        <ListItemIcon
          title="Change chat name"
        />
        <ListItemIcon
          title="Change Photo"
        />
        <ListItemIcon
          title="Leave group"
        />
        <Heading>Chat members</Heading>
        {
          members.map((user) => {
            return(
              <ListItem
                title={user.name}
                avatarSrc={user.avatar}
                avatarSize="sm"
              />
            );
          })
        }
        <ListItemIcon
          title="Add people"
        />
      </Flex>
    </SidePanel>
  );
}