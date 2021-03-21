import { Flex } from '@chakra-ui/react';
import { UserDataArr, UserData, GroupDataWithUsers} from 'api/validators/entity';
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
          />
        )
      }
    </Flex>

  );
}

interface GroupSearchListProps{
  searchResults: Array<GroupDataWithUsers>,
  onClick: (e: React.MouseEvent<HTMLDivElement>, item: GroupDataWithUsers) => void,
}
export const GroupSearchLIst = ({searchResults, onClick}: GroupSearchListProps) => {
  return(
    <Flex
      flexDir="column"
    >
      {
        searchResults.map((item: GroupDataWithUsers, i: number) => 
          <ListItem
            key={i}
            title={item.name || item.users.reduce((acc, user) => {
              acc += user.name.split(' ')[0]; // take the first name
              return acc;
            }, "")}
            avatarSrc={item.avatar}
            onClick={(e) => {onClick(e, item)}}
          />
        )
      }
    </Flex>

  );
}