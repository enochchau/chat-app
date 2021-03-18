import { Flex } from '@chakra-ui/react';
import { GroupItem } from './item';
import * as React from 'react';
import { GroupMessageDataArr } from '../../api/validators/entity';

interface GroupListProps{
  groupData: GroupMessageDataArr; // change this later
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
            title={group.groupName}
            // avatarSrc={group.avatar} // come back and implement this later...
            lastMessage={group.lastMessage}
            lastTimestamp={group.lastTimestamp}
          />
        )
      }
    </Flex>
  );
}