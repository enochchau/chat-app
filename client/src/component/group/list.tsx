import { Flex } from '@chakra-ui/react';
import { GroupItem } from './item';
import * as React from 'react';
import { GroupMessageData} from '../../api/validators/entity';
import { useContext } from 'react';
import { StoreContext } from '../../store';
import { trimGroupName } from '../../util/trimName';

interface GroupListProps{
  groupData: GroupMessageData[];
  onClick: (_e: React.MouseEvent<HTMLDivElement>, _groupId: number) => void;
}
export const GroupList: React.FC<GroupListProps> = ({groupData, onClick}) => {

  const {storeState} = useContext(StoreContext);

  return(
    <Flex
      flexDir="column"
    >
      {
        groupData.map((group, i) => 
          <GroupItem
            key={i}
            title={trimGroupName(group.groupName, storeState.name)}
            avatarSrc={group.groupAvatar || undefined} 
            lastMessage={group.lastMessage || undefined}
            lastTimestamp={group.lastTimestamp || undefined}
            onClick={(e): void => {onClick(e, group.groupId)}}
          />
        )
      }
    </Flex>
  );
}