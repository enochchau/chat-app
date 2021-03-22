import { Flex } from '@chakra-ui/react';
import { UserData, GroupData} from 'api/validators/entity';
import * as React from 'react';
import { ListItem } from '../listItem';

interface UserSearchListProps{
  searchResults: Array<UserData>,
  onClick: (e: React.MouseEvent<HTMLDivElement>, item: UserData) => void,
}
export const UserSearchList = ({searchResults, onClick}: UserSearchListProps) => {
  return(
    <Flex
      flexDir="column"
    >
      {
        searchResults.map((item: UserData, i: number) => 
          <ListItem
            key={i}
            title={item.name}
            avatarSrc={item.avatar}
            onClick={(e) => {onClick(e, item)}}
            avatarSize="sm"
            variant="userSearch"
          />
        )
      }
    </Flex>

  );
}

interface GroupSearchListProps{
  searchResults: Array<GroupData>,
  onClick: (e: React.MouseEvent<HTMLDivElement>, item: GroupData) => void,
}
export const GroupSearchList = ({searchResults, onClick}: GroupSearchListProps) => {
  return(
    <Flex
      flexDir="column"
    >
      {
        searchResults.map((item: GroupData, i: number) => 
          <ListItem
            key={i}
            title={item.name} 
            onClick={(e) => {onClick(e, item)}}
          />
        )
      }
    </Flex>

  );
}