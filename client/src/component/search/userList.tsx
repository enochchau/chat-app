import { Flex } from '@chakra-ui/react';
import { UserDataArr, UserData } from 'api/validators/entity';
import * as React from 'react';
import { SearchResult } from './result';

interface UserSearchListProps {
  searchResults: UserDataArr,
  onClick: (e: React.MouseEvent<HTMLDivElement>, user: UserData) => void,
}
export const UserSearchList = ({searchResults, onClick}: UserSearchListProps) => {
  return(
    <Flex
      flexDir="column"
    >
      {
        searchResults.map((item, i) => 
          <SearchResult
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
