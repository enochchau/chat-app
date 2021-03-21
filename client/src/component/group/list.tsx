import { Flex } from '@chakra-ui/react';
import { GroupItem } from './item';
import * as React from 'react';
import { GroupMessageDataArr } from '../../api/validators/entity';

interface GroupListProps{
  groupData: GroupMessageDataArr;
  onClick: (e: React.MouseEvent<HTMLDivElement>, groupId: number) => void;
}
export const GroupList = ({groupData, onClick}: GroupListProps) => {
  return(
    <Flex
      flexDir="column"
    >
      {
        groupData.map((group, i) => 
          <GroupItem
            key={i}
            title={group.groupName}
            avatarSrc={group.groupAvatar || undefined} 
            lastMessage={group.lastMessage || undefined}
            lastTimestamp={group.lastTimestamp || undefined}
            onClick={(e) => {onClick(e, group.groupId)}}
          />
        )
      }
    </Flex>
  );
}