import { Flex } from '@chakra-ui/react';
import { GroupItem } from './item';
import * as React from 'react';
import { GroupDataArr } from '../../api';

interface GroupListProps{
  groupData: GroupDataArr; // change this later
}
export const GroupList = ({groupData}: GroupListProps) => {
  return(
    <Flex
      flexDir="column"
    >
      {
        groupData.map((group, i) => 
          <GroupItem
            key={i}
            title={group.name}
            avatarSrc={group.avatar}
            lastMessage={group.lastMessage}
            lastTimestamp={group.lastTimestamp}
          />
        )
      }
    </Flex>
  );
}