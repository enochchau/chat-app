import { Flex } from '@chakra-ui/react';
import { GroupItem } from './item';
import * as React from 'react';
import { GroupMessageDataArr, UserData, UserDataArr } from '../../api/validators/entity';

interface GroupListProps{
  groupData: GroupMessageDataArr; // change this later
  userData: Array<UserData>;
}
export const GroupList = ({groupData, userData}: GroupListProps) => {
  return(
    <Flex
      flexDir="column"
    >
      {
        groupData.map((group, i) => 
          <GroupItem
            key={i}
            title={group.groupName || userData.reduce((acc, user) => {
              acc += user.name.split(' ')[0];
              return acc;
            }, "")}
            avatarSrc={group.groupAvatar || undefined} 
            lastMessage={group.lastMessage || undefined}
            lastTimestamp={group.lastTimestamp || undefined}
          />
        )
      }
    </Flex>
  );
}