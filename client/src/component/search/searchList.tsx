import { Flex } from '@chakra-ui/react';
import { UserData, GroupData} from 'api/validators/entity';
import * as React from 'react';
import { ListItem } from '../listItem';

type SearchItem = {
  name: string,
  avatar: string | null,
}
interface SearchListProps<T extends SearchItem>{
  searchResults: T[];
  onClick: (_e: React.MouseEvent<HTMLDivElement>, _item: T) => void;
}
const SearchList = <T extends SearchItem> ({searchResults, onClick}: SearchListProps<T>) => {
  return(
    <Flex
      flexDir="column"
    >
      {
        searchResults.map((item: T, i: number) => 
          <ListItem
            key={i}
            title={item.name}
            avatarSrc={item.avatar}
            onClick={(e):void => {onClick(e, item)}}
            avatarSize="sm"
            variant="userSearch"
          />
        )
      }
    </Flex>
  );
}

interface UserSearchListProps{
  searchResults: Array<UserData>,
  onClick: (_e: React.MouseEvent<HTMLDivElement>, _item: UserData) => void,
}
export const UserSearchList = ({searchResults, onClick}: UserSearchListProps) => SearchList<UserData>({searchResults, onClick});

interface GroupSearchListProps{
  searchResults: Array<GroupData>,
  onClick: (_e: React.MouseEvent<HTMLDivElement>, _item: GroupData) => void,
}
export const GroupSearchList = ({searchResults, onClick}: GroupSearchListProps) => SearchList<GroupData>({searchResults, onClick});